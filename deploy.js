import child_process from 'node:child_process'
import fs from 'fs'
import { NodeSSH } from 'node-ssh'
import * as dotenv from 'dotenv'
import readline from 'node:readline'
dotenv.config()

async function prompt(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
  return new Promise(resolve => {
    rl.question(question, answer => {
      rl.close()
      resolve(answer)
    })
  })
}

async function confirm(question) {
  const answer = await prompt(question)
  return answer.toLowerCase() === 'y'
}

async function deploy(archivePath, deployDir) {
  console.log(`Deploying ${archivePath} to ${deployDir}...`)

  const ssh = new NodeSSH()
  await ssh.connect({
    host: process.env.SSH_HOST,
    username: process.env.SSH_USER,
    password: process.env.SSH_PASSWORD,
  })

  try {
    await ssh.putFile(archivePath, `${deployDir}/build.tar.gz`)
    console.log(`\u2713 Archive uploaded to server.`)
  } catch (e) {
    throw new Error(`Can't upload archive: ${e.message}`)
  }

  try {
    await ssh.execCommand(`rm -rf ~/${deployDir}/build_tmp`)
    const resMkdir = await ssh.execCommand(`mkdir -p ~/${deployDir}/build_tmp`)
    if (resMkdir.stderr) throw new Error(resMkdir.stderr)
    const resUnpack = await ssh.execCommand(`tar -xf ~/${deployDir}/build.tar.gz -C ~/${deployDir}/build_tmp`)
    if (resUnpack.stderr) throw new Error(resUnpack.stderr)
    console.log(`\u2713 Archive unpacked to build_tmp.`)
    const resRemove = await ssh.execCommand(`rm -rf ~/${deployDir}/build`)
    if (resRemove.stderr) throw new Error(resRemove.stderr)
    console.log(`\u2713 Old build removed.`)
    const resRename = await ssh.execCommand(`mv ~/${deployDir}/build_tmp ~/${deployDir}/build`)
    if (resRename.stderr) throw new Error(resRename.stderr)
    console.log(`\u2713 New build activated.`)
    const resSymlink = await ssh.execCommand(`ln -s ~/static ~/${deployDir}/build/public/static`)
    if (resSymlink.stderr) throw new Error(resSymlink.stderr)
    console.log(`\u2713 Symlink for static created.`)
    const resDelArchive = await ssh.execCommand(`rm -f ~/${deployDir}/build.tar.gz`)
    if (resDelArchive.stderr) throw new Error(resDelArchive.stderr)
    console.log(`\u2713 Archive removed from server.`)
  } catch (e) {
    throw new Error(`Can't deploy new build: ${e.message}`)
  }

  try {
    await ssh.execCommand(`mkdir -p ~/${deployDir}/build/server/tmp`)
    const res = await ssh.execCommand(`touch ~/${deployDir}/build/server/tmp/restart.txt`)
    if (res.stderr) throw new Error(res.stderr)
    console.log(`\u2713 Server restarted.`)
  } catch (e) {
    throw new Error(`Can't restart server: ${e.message}`)
  }

  await ssh.execCommand('exit')
  console.log(`Deploying finished. Now make sure to clear the cache in admin panel!`)

  try {
    child_process.execSync(`start chrome "https://${deployDir}/admin/options"`)
  } catch (e) {
    console.log(`Couldn't open Chrome: ${e.message}`)
  }
}

async function main() {
  const isRedeploy = process.argv.includes('--redeploy')
  let archivePath
  let deployDir
  let isProduction

  if (isRedeploy) {
    console.log('Starting redeployment from an existing archive...')
    const archiveDir = 'archived_builds'
    const archives = fs
      .readdirSync(archiveDir)
      .filter(file => file.endsWith('.tar.gz'))
      .map(file => ({ name: file, time: fs.statSync(`${archiveDir}/${file}`).mtime }))
      .sort((a, b) => b.time - a.time)

    if (archives.length === 0) {
      console.log('No archives found in /archived_builds. Aborting.')
      return
    }

    console.log('Please choose an archive to deploy:')
    archives.forEach((archive, index) =>
      console.log(`${index + 1}: ${archive.name} (${archive.time.toLocaleString()})`),
    )

    const choice = await prompt(`Enter the number of the archive (1-${archives.length}): `)
    const choiceIndex = parseInt(choice, 10) - 1

    if (isNaN(choiceIndex) || choiceIndex < 0 || choiceIndex >= archives.length) {
      console.log('Invalid selection. Aborting.')
      return
    }

    const selectedArchive = archives[choiceIndex]
    archivePath = `${archiveDir}/${selectedArchive.name}`
    isProduction = !selectedArchive.name.startsWith('test_')
  } else {
    isProduction = process.env.NUXT_BUILD_MODE === 'prod'
    const now = new Date()
    const timestamp = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16)
      .replace('T', '_')
      .replace(':', '-')
    const buildType = isProduction ? 'prod' : 'test'
    const archiveName = `${buildType}_${timestamp}.tar.gz`
    archivePath = `archived_builds/${archiveName}`
    try {
      child_process.execSync(`tar -czf ${archivePath} -C .output public server nitro.json`, { stdio: 'inherit' })
      console.log(`\u2713 Archive created: ${archivePath}`)
    } catch (e) {
      throw new Error(`Can't create archive: ${e.message}`)
    }
  }

  deployDir = isProduction ? 'chelinstrument.ru' : 'test.chelinstrument.ru'

  let confirmed = false
  if (isProduction) {
    confirmed = await confirm(`⚠️  You are about to deploy to PRODUCTION (${deployDir}). Are you sure? (y/n) `)
  } else if (isRedeploy) {
    confirmed = await confirm(`Are you sure you want to deploy this TEST archive: ${archivePath}? (y/n) `)
  } else {
    confirmed = true // For new test builds, no extra confirmation is needed.
  }

  if (!confirmed) {
    console.log('Deployment cancelled.')
    return
  }

  await deploy(archivePath, deployDir)
}

main()
  .catch(e => {
    console.log(`Error! Can't deploy: ${e.message}`)
  })
  .finally(() => {
    process.exit()
  })
