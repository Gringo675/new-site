import net from 'node:net'
import { Client } from 'ssh2'
import * as dotenv from 'dotenv'
import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, '..')
dotenv.config({ path: path.resolve(projectRoot, '.env') })

if (!process.env.SSH_HOST) {
  console.log('[tunnel] SSH_HOST не задан в .env. Запуск без SSH-туннеля.')
  process.exit(0)
}

const LOCAL_PORT = parseInt(process.env.DB_PORT || '3306', 10)
const REMOTE_PORT = 3306
const REMOTE_HOST = '127.0.0.1'

let currentSsh = null
let isConnected = false
let isConnecting = false
const activeSockets = new Set()

// Создаем TCP-сервер один раз
const server = net.createServer(sock => {
  activeSockets.add(sock)
  sock.on('close', () => activeSockets.delete(sock))

  // Если SSH прямо сейчас в процессе переподключения (например, при смене VPN)
  if (!isConnected || !currentSsh) {
    console.warn('[tunnel] Запрос к БД отклонен: SSH туннель переподключается...')
    sock.destroy(new Error('SSH tunnel is reconnecting'))
    return
  }

  try {
    currentSsh.forwardOut(sock.remoteAddress, sock.remotePort, REMOTE_HOST, REMOTE_PORT, (err, stream) => {
      if (err) {
        console.error('[tunnel] Ошибка пересылки трафика:', err.message)
        sock.destroy()
        return
      }

      sock.pipe(stream).pipe(sock)

      stream.on('close', () => sock.destroy())
      sock.on('error', () => stream.destroy())
    })
  } catch (err) {
    console.error('[tunnel] Исключение при forwardOut:', err.message)
    sock.destroy()
  }
})

server.listen(LOCAL_PORT, '127.0.0.1', () => {
  console.log(`[tunnel] \u2713 Прослушивание порта 127.0.0.1:${LOCAL_PORT}...`)
  connectSSH()
})

server.on('error', err => {
  if (err.code === 'EADDRINUSE') {
    console.log(`[tunnel] Порт ${LOCAL_PORT} уже слушается другим процессом (туннелем или локальной БД). Режим ожидания.`)
    return
  }
  console.error(`[tunnel] Критическая ошибка локального порта ${LOCAL_PORT}:`, err.message)
  process.exit(1)
})

function connectSSH() {
  if (isConnecting) return
  isConnecting = true
  isConnected = false

  // Сбрасываем старые зависшие сокеты пула MySQL
  for (const sock of activeSockets) {
    sock.destroy()
  }
  activeSockets.clear()

  if (currentSsh) {
    try {
      currentSsh.end()
    } catch {}
    currentSsh = null
  }

  const ssh = new Client()
  currentSsh = ssh

  ssh.on('ready', () => {
    isConnecting = false
    isConnected = true
    console.log(`[tunnel] \u2713 SSH соединение активно: 127.0.0.1:${LOCAL_PORT} -> ${process.env.SSH_HOST}:${REMOTE_PORT}`)
  })

  ssh.on('close', () => {
    const wasConnected = isConnected
    isConnected = false
    isConnecting = false

    for (const sock of activeSockets) {
      sock.destroy()
    }
    activeSockets.clear()

    if (wasConnected) {
      console.warn('[tunnel] Соединение разорвано. Переподключение через 2 сек...')
    }
    setTimeout(connectSSH, 2000)
  })

  ssh.on('error', err => {
    console.error('[tunnel] Ошибка SSH:', err.message)
    // событие 'close' вызовется следом и запустит реконнект
  })

  const sshConfig = {
    host: process.env.SSH_HOST,
    port: parseInt(process.env.SSH_PORT || '22', 10),
    username: process.env.SSH_USER,
    keepaliveInterval: 15000,
    keepaliveCountMax: 3,
    readyTimeout: 10000,
  }

  if (process.env.SSH_KEY_PATH) {
    const keyPath = path.isAbsolute(process.env.SSH_KEY_PATH)
      ? process.env.SSH_KEY_PATH
      : path.resolve(projectRoot, process.env.SSH_KEY_PATH)
    sshConfig.privateKey = fs.readFileSync(keyPath)
  } else if (process.env.SSH_PASSWORD) {
    sshConfig.password = process.env.SSH_PASSWORD
  }

  try {
    ssh.connect(sshConfig)
  } catch (err) {
    console.error('[tunnel] Ошибка connect:', err.message)
    setTimeout(connectSSH, 2000)
  }
}
