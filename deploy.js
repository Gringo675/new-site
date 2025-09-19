import child_process from 'node:child_process'
import fs from 'fs'
import { NodeSSH } from 'node-ssh'
import * as dotenv from 'dotenv'
dotenv.config()

try {
  console.log(`Deploying started...`)
  // create archive
  try {
    child_process.execSync('tar -czf .output/build.tar.gz -C .output public server nitro.json', { stdio: 'inherit' })
    console.log(`\u2713 Archive created.`)
  } catch (e) {
    throw new Error(`Can't create archive: ${e.message}`)
  }
  const ssh = new NodeSSH()
  await ssh.connect({
    host: process.env.SSH_HOST,
    username: process.env.SSH_USER,
    password: process.env.SSH_PASSWORD,
  })
  // upload archive to server
  try {
    await ssh.putFile('.output/build.tar.gz', 'test.chelinstrument.ru/build.tar.gz')
    console.log(`\u2713 Archive uploaded to server.`)
    // Удаляем локальный архив
    fs.unlinkSync('.output/build.tar.gz')
    console.log(`\u2713 Local archive removed.`)
  } catch (e) {
    throw new Error(`Can't upload archive: ${e.message}`)
  }
  // unpack archive on server
  try {
    // Распаковываем архив во временную папку
    await ssh.execCommand('rm -rf ~/test.chelinstrument.ru/build_tmp')
    const resMkdir = await ssh.execCommand('mkdir -p ~/test.chelinstrument.ru/build_tmp')
    if (resMkdir.stderr.length) throw new Error(resMkdir.stderr)
    const resUnpack = await ssh.execCommand(
      'tar -xf ~/test.chelinstrument.ru/build.tar.gz -C ~/test.chelinstrument.ru/build_tmp',
    )
    if (resUnpack.stderr.length) throw new Error(resUnpack.stderr)
    console.log(`\u2713 Archive unpacked to build_tmp.`)

    // Удаляем старую папку билда
    const resRemove = await ssh.execCommand('rm -rf ~/test.chelinstrument.ru/build')
    if (resRemove.stderr.length) throw new Error(resRemove.stderr)
    console.log(`\u2713 Old build removed.`)

    // Переименовываем временную папку в рабочую
    const resRename = await ssh.execCommand('mv ~/test.chelinstrument.ru/build_tmp ~/test.chelinstrument.ru/build')
    if (resRename.stderr.length) throw new Error(resRename.stderr)
    console.log(`\u2713 New build activated.`)

    // Создаём симлинк static → build/public/static
    const resSymlink = await ssh.execCommand('ln -s ~/static ~/test.chelinstrument.ru/build/public/static')
    if (resSymlink.stderr.length) throw new Error(resSymlink.stderr)
    console.log(`\u2713 Symlink for static created.`)

    // Удаляем архив
    const resDelArchive = await ssh.execCommand('rm -f ~/test.chelinstrument.ru/build.tar.gz')
    if (resDelArchive.stderr.length) throw new Error(resDelArchive.stderr)
    console.log(`\u2713 Archive removed from server.`)
  } catch (e) {
    throw new Error(`Can't deploy new build: ${e.message}`)
  }

  // touch restart.txt
  try {
    const res = await ssh.execCommand('touch ~/test.chelinstrument.ru/tmp/restart.txt')
    if (res.stderr.length) throw new Error(res.stderr)
    console.log(`\u2713 Server restarted.`)
  } catch (e) {
    throw new Error(`Can't rewrite restart.txt: ${e.message}`)
  }
  await ssh.execCommand('exit')
  console.log(`Deploying finished.`)
} catch (e) {
  console.log(`Error! Can't deploy: ${e.message}`)
} finally {
  process.exit()
}
