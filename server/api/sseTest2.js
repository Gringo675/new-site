import { PassThrough } from 'node:stream'
import { sendStream } from 'h3'

const tunnel = new PassThrough();

tunnel.on("data", (data) => {
    console.log("tunnel data:", data.toString())
})

let i = 0
const writeToTunnel = () => {
    i++
    tunnel.write(`event: random\ndata: ${JSON.stringify(i)}\n\n`)
}

// setInterval(writeToTunnel, 3000)

export default defineEventHandler((event) => {
    event.node.res.writeHead(200, {
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Content-Type': 'text/event-stream',
    });

    event.node.req.on('close', () => console.log(`from close`));
    event.node.req.on('end', () => console.log(`from end`));
    event.node.req.on('error', () => console.log(`from error`));
    event.node.req.on('pause', () => console.log(`from pause`));

    event.node.req.addListener('close', () => console.log(`from close`));
    event.node.req.addListener('end', () => console.log(`from end`));
    event.node.req.addListener('error', () => console.log(`from error`));
    event.node.req.addListener('pause', () => console.log(`from pause`));

    return sendStream(event, tunnel)
})