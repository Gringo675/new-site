import net from 'net'

export default defineEventHandler(async event => {
  const HOST = '2.26.114.183' // Replace with actual VPS IP
  const PORT = 22 // SSH port
  const TIMEOUT = 5000 // 5 seconds timeout

  return new Promise(resolve => {
    const socket = new net.Socket()

    // Set timeout
    socket.setTimeout(TIMEOUT)

    const finish = result => {
      socket.destroy()
      resolve(result)
    }

    socket.on('connect', () => {
      finish({
        success: true,
        message: 'VPS is accessible',
        host: HOST,
        port: PORT,
      })
    })

    socket.on('timeout', () => {
      finish({
        success: false,
        message: 'Connection timeout',
        host: HOST,
        port: PORT,
      })
    })

    socket.on('error', error => {
      finish({
        success: false,
        message: error.message,
        host: HOST,
        port: PORT,
      })
    })

    socket.connect(PORT, HOST)
  })
})
