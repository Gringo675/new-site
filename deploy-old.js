require('dotenv').config()
const FtpDeploy = require("ftp-deploy");
const ftp = require('ftp');

const deployFiles = async () => {
    return
    const ftpDeploy = new FtpDeploy();
    const config = {
        host: process.env.FTP_HOST,
        user: process.env.FTP_USER,
        password: process.env.FTP_PASSWORD,
        port: 21,
        localRoot: __dirname + "/.output/",
        remoteRoot: "/chelinstrument.ru/public_html/test/build/",
        include: ["*", "**/*"],      // this would upload everything except dot files
        deleteRemote: true,
        forcePasv: true,
        sftp: false,
    };
    console.log(`Copying files...`)
    await ftpDeploy.deploy(config)
}

const restartServer = async () => {
    let promise = new Promise((resolve) => {
        const ftpClient = new ftp();
        const ftpConfig = {
            host: process.env.FTP_HOST,
            user: process.env.FTP_USER,
            password: process.env.FTP_PASSWORD,
        };
        ftpClient.connect(ftpConfig);
        ftpClient.on('ready', function () {
            console.log(`Rewrite restart.txt...`)
            ftpClient.put('', '/chelinstrument.ru/public_html/test/tmp/restart.txt', function (err) {
                if (err) throw err;
                ftpClient.end();
                resolve()
            });
        });
    });
    return await promise
}

console.log(`Start deploying...`)
deployFiles().then(() => restartServer().then(() => console.log(`Deploying finished!`)))

