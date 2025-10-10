import child_process from 'node:child_process'
import fs from 'fs'
import { NodeSSH } from 'node-ssh'
import * as dotenv from 'dotenv'
import readline from 'node:readline'
dotenv.config()

if (process.env.NUXT_BUILD_MODE === 'prod') {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
  const answer = await new Promise(resolve => {
    rl.question('⚠️  You are about to deploy to PRODUCTION. Are you sure you want to continue? (y/n) ', resolve)
  })
  rl.close()
  if (answer.toLowerCase() !== 'y') {
    console.log('Deployment cancelled.')
    process.exit()
  }
}

const DEPLOY_DIR = process.env.NUXT_BUILD_MODE === 'prod' ? 'chelinstrument.ru' : 'test.chelinstrument.ru'

try {
  console.log(`Deploying started...`)
  // create archive
  try {
    child_process.execSync('tar -czf .output/build.tar.gz -C .output public server nitro.json', { stdio: 'inherit' })
    console.log(`\u2713 Archive created.`)
  } catch (e) {
    const errMsg = e && typeof e === 'object' && 'message' in e ? e.message : String(e)
    throw new Error(`Can't create archive: ${errMsg}`)
  }
  const ssh = new NodeSSH()
  await ssh.connect({
    host: process.env.SSH_HOST,
    username: process.env.SSH_USER,
    password: process.env.SSH_PASSWORD,
  })
  // upload archive to server
  try {
    await ssh.putFile('.output/build.tar.gz', `${DEPLOY_DIR}/build.tar.gz`)
    console.log(`\u2713 Archive uploaded to server.`)
    // Удаляем локальный архив
    fs.unlinkSync('.output/build.tar.gz')
    console.log(`\u2713 Local archive removed.`)
  } catch (e) {
    const errMsg = e && typeof e === 'object' && 'message' in e ? e.message : String(e)
    throw new Error(`Can't upload archive: ${errMsg}`)
  }
  // unpack archive on server
  try {
    // Распаковываем архив во временную папку
    await ssh.execCommand(`rm -rf ~/${DEPLOY_DIR}/build_tmp`)
    const resMkdir = await ssh.execCommand(`mkdir -p ~/${DEPLOY_DIR}/build_tmp`)
    if (resMkdir.stderr.length) throw new Error(resMkdir.stderr)
    const resUnpack = await ssh.execCommand(`tar -xf ~/${DEPLOY_DIR}/build.tar.gz -C ~/${DEPLOY_DIR}/build_tmp`)
    if (resUnpack.stderr.length) throw new Error(resUnpack.stderr)
    console.log(`\u2713 Archive unpacked to build_tmp.`)

    // Удаляем старую папку билда
    const resRemove = await ssh.execCommand(`rm -rf ~/${DEPLOY_DIR}/build`)
    if (resRemove.stderr.length) throw new Error(resRemove.stderr)
    console.log(`\u2713 Old build removed.`)

    // Переименовываем временную папку в рабочую
    const resRename = await ssh.execCommand(`mv ~/${DEPLOY_DIR}/build_tmp ~/${DEPLOY_DIR}/build`)
    if (resRename.stderr.length) throw new Error(resRename.stderr)
    console.log(`\u2713 New build activated.`)

    // Создаём симлинк static → build/public/static
    const resSymlink = await ssh.execCommand(`ln -s ~/static ~/${DEPLOY_DIR}/build/public/static`)
    if (resSymlink.stderr.length) throw new Error(resSymlink.stderr)
    console.log(`\u2713 Symlink for static created.`)

    // Удаляем архив
    const resDelArchive = await ssh.execCommand(`rm -f ~/${DEPLOY_DIR}/build.tar.gz`)
    if (resDelArchive.stderr.length) throw new Error(resDelArchive.stderr)
    console.log(`\u2713 Archive removed from server.`)
  } catch (e) {
    const errMsg = e && typeof e === 'object' && 'message' in e ? e.message : String(e)
    throw new Error(`Can't deploy new build: ${errMsg}`)
  }

  // touch restart.txt
  try {
    const res = await ssh.execCommand(`touch ~/${DEPLOY_DIR}/tmp/restart.txt`)
    if (res.stderr.length) throw new Error(res.stderr)
    console.log(`\u2713 Server restarted.`)
  } catch (e) {
    const errMsg = e && typeof e === 'object' && 'message' in e ? e.message : String(e)
    throw new Error(`Can't rewrite restart.txt: ${errMsg}`)
  }
  await ssh.execCommand('exit')
  console.log(`Deploying finished.`)
} catch (e) {
  const errMsg = e && typeof e === 'object' && 'message' in e ? e.message : String(e)
  console.log(`Error! Can't deploy: ${errMsg}`)
} finally {
  process.exit()
}
