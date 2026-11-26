import net from 'node:net'
import { spawn } from 'node:child_process'
import { Client } from 'ssh2'
import * as dotenv from 'dotenv'
import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, '..')
dotenv.config({ path: path.resolve(projectRoot, '.env') })

const LOCAL_PORT = parseInt(process.env.DB_PORT || '3306', 10)
const REMOTE_PORT = 3306
const REMOTE_HOST = '127.0.0.1'

/**
 * Проверка, слушает ли уже кто-то порт (например, запущенный npm run dev или локальный MySQL)
 */
function checkPortOpen(port, host = '127.0.0.1', timeout = 800) {
  return new Promise(resolve => {
    const socket = new net.Socket()
    socket.setTimeout(timeout)

    socket.once('connect', () => {
      socket.destroy()
      resolve(true)
    })

    socket.once('timeout', () => {
      socket.destroy()
      resolve(false)
    })

    socket.once('error', () => {
      socket.destroy()
      resolve(false)
    })

    socket.connect(port, host)
  })
}

/**
 * Запуск переданной команды (например, nuxt build)
 */
function runCommand(commandArgs) {
  return new Promise(resolve => {
    if (commandArgs.length === 0) {
      console.error('[with-tunnel] Ошибка: команда не указана.')
      process.exit(1)
    }

    const commandLine = commandArgs
      .map(arg => (arg.includes(' ') && !arg.startsWith('"') ? `"${arg}"` : arg))
      .join(' ')

    const child = spawn(commandLine, {
      stdio: 'inherit',
      shell: true,
      env: process.env,
    })

    child.on('exit', (code, signal) => {
      if (signal) {
        resolve(1)
      } else {
        resolve(code ?? 0)
      }
    })
  })
}

/**
 * Поднятие временного SSH-туннеля строго на время выполнения команды
 */
function startTemporaryTunnel() {
  return new Promise((resolve, reject) => {
    const ssh = new Client()
    let server = null

    ssh.on('ready', () => {
      server = net.createServer(sock => {
        ssh.forwardOut(
          sock.remoteAddress,
          sock.remotePort,
          REMOTE_HOST,
          REMOTE_PORT,
          (err, stream) => {
            if (err) {
              sock.destroy()
              return
            }
            sock.pipe(stream).pipe(sock)
            stream.on('close', () => sock.destroy())
            sock.on('error', () => stream.destroy())
          }
        )
      })

      server.listen(LOCAL_PORT, '127.0.0.1', () => {
        console.log(`[with-tunnel] \u2713 Временный SSH-туннель открыт на 127.0.0.1:${LOCAL_PORT}`)
        resolve({
          close: () => {
            try {
              server.close()
            } catch {}
            try {
              ssh.end()
            } catch {}
          },
        })
      })

      server.on('error', err => {
        try {
          ssh.end()
        } catch {}
        reject(err)
      })
    })

    ssh.on('error', err => {
      reject(err)
    })

    const sshConfig = {
      host: process.env.SSH_HOST,
      port: parseInt(process.env.SSH_PORT || '22', 10),
      username: process.env.SSH_USER,
      keepaliveInterval: 15000,
      keepaliveCountMax: 3,
      readyTimeout: 15000,
    }

    if (process.env.SSH_KEY_PATH) {
      const keyPath = path.isAbsolute(process.env.SSH_KEY_PATH)
        ? process.env.SSH_KEY_PATH
        : path.resolve(projectRoot, process.env.SSH_KEY_PATH)
      sshConfig.privateKey = fs.readFileSync(keyPath)
    } else if (process.env.SSH_PASSWORD) {
      sshConfig.password = process.env.SSH_PASSWORD
    }

    ssh.connect(sshConfig)
  })
}

async function main() {
  const commandArgs = process.argv.slice(2)
  if (commandArgs.length === 0) {
    console.error('[with-tunnel] Укажите команду для выполнения.')
    process.exit(1)
  }

  const isOpen = await checkPortOpen(LOCAL_PORT)
  let tunnel = null

  if (isOpen) {
    console.log(`[with-tunnel] Порт ${LOCAL_PORT} уже доступен (используется существующий туннель или БД).`)
  } else if (process.env.SSH_HOST) {
    console.log(`[with-tunnel] Порт ${LOCAL_PORT} закрыт. Поднимаем временный SSH-туннель...`)
    try {
      tunnel = await startTemporaryTunnel()
    } catch (err) {
      console.error(`[with-tunnel] Не удалось поднять туннель:`, err.message)
      console.log(`[with-tunnel] Пробуем выполнить команду без туннеля...`)
    }
  }

  try {
    const exitCode = await runCommand(commandArgs)
    if (tunnel) {
      console.log('[with-tunnel] Закрываем временный SSH-туннель.')
      tunnel.close()
    }
    process.exit(exitCode)
  } catch (err) {
    if (tunnel) {
      tunnel.close()
    }
    console.error('[with-tunnel] Ошибка:', err)
    process.exit(1)
  }
}

main()
