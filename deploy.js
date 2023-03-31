import child_process from "node:child_process"
import {NodeSSH} from 'node-ssh'
import * as dotenv from 'dotenv'
dotenv.config()

try {
    console.log(`Deploying started...`)
    // create archive
    try {
        const commands = [
            'cd .output', // go to dir for archive has no .output dir
            'tar -czf build.tar.gz public/*.* server/*.* nitro.json' // can't use just *.*, because archive itself in the same dir
        ]
        child_process.execSync(commands.join(' && '), {stdio: 'inherit'})
        console.log(`\u2713 Archive created.`)
    } catch (e) {
        throw new Error(`Can't create archive: ${e.message}`)
    }
    const ssh = new NodeSSH()
    await ssh.connect({
        host: process.env.SSH_HOST,
        username: process.env.SSH_USER,
        password: process.env.SSH_PASSWORD
    })
    // upload archive to server
    try {
        await ssh.putFile('.output/build.tar.gz', 'chelinstrument.ru/public_html/test/build.tar.gz')
        console.log(`\u2713 Archive uploaded to server.`)
    } catch (e) {
        throw new Error(`Can't upload archive: ${e.message}`)
    }
    // unpack archive on server
    try {
        await ssh.execCommand('rm -rf ~/chelinstrument.ru/public_html/test/build/*') // clear dir
        const res = await ssh.execCommand('tar -xf ~/chelinstrument.ru/public_html/test/build.tar.gz -C ~/chelinstrument.ru/public_html/test/build')
        if (res.stderr.length) throw new Error(res.stderr)
        console.log(`\u2713 Archive unpacked.`)
    } catch (e) {
        throw new Error(`Can't unpack archive: ${e.message}`)
    }
    // touch restart.txt
    try {
        const res = await ssh.execCommand('touch ~/chelinstrument.ru/public_html/test/tmp/restart.txt')
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