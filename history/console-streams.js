import { PassThrough } from 'node:stream'
import { sendStream } from 'h3'

process.cvStream = new PassThrough();

process.cvStream.on("data", (data) => { // это позволяет не накапливать незапрошенные вызовы
    // можно логировать поток в файл
})

export default defineEventHandler((event) => {

    event.node.res.writeHead(200, {
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Content-Type': 'text/event-stream',
    });


    setTimeout(() => process.cvStream.write(`event: newConnection\ndata: Установлено новое соединение.\n\n`), 10)

    return sendStream(event, process.cvStream)
})