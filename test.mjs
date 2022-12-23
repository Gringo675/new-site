import http from 'http'
const port = 8001
const listeners = []

const server = http.createServer((req, res) => {
    res.writeHead(200, {
        Connection: 'keep-alive',
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache'
    })
    listeners.push(res)
})

const sendRandom = () => {
    const data = Math.random()
    listeners.forEach( res => {
        res.write(`event: random\ndata: ${JSON.stringify(data)}\n\n`)
    })
}
server.listen(port)
console.log(`Server started at http://localhost:${port}`)

// setInterval(sendRandom, 3000)