import http from 'node:http'

const port = 8001
const listeners = []

const server = http.createServer((req, res) => {
    // res.setHeader('Access-Control-Allow-Origin', '*')
    res.writeHead(200, {
        'Access-Control-Allow-Origin': '*',
        'Connection': 'keep-alive',
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache'
    })

    listeners.push(res)

    req.on('close', () => console.log(`from close`));
    req.on('end', () => console.log(`from end`));
    req.on('error', () => console.log(`from error`));
    req.on('pause', () => console.log(`from pause`));

    req.addListener('close', () => console.log(`from close`));
    req.addListener('end', () => console.log(`from end`));
    req.addListener('error', () => console.log(`from error`));
    req.addListener('pause', () => console.log(`from pause`));
})

const sendRandom = () => {
    console.log(`listeners: ${listeners.length}`)
    const data = Math.random()
    listeners.forEach(res => {
        res.write(`event: random\ndata: ${JSON.stringify(data)}\n\n`)
    })
}
server.listen(port)
console.log(`Server started at http://localhost:${port}`)

setInterval(sendRandom, 5000)