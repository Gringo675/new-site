import crypto from "crypto";
import { sendStream } from 'h3'

const listeners = []

// const deleteListener = (id) => {
//     console.log(`from deleteListener`)
// }
const sendRandom = () => {
    console.log(`listeners: ${listeners.length}`)
    const data = Math.random()
    listeners.forEach(listener => {
        listener.event.node.res.write(`event: random\ndata: ${JSON.stringify(data)}\n\n`)
    })
}
// setInterval(sendRandom, 5000)
export default defineEventHandler(async (event) => {

    event.node.res.writeHead(200, {
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
        'Content-Type': 'text/event-stream',
    });

    const id = crypto.randomUUID()

    listeners.push({id, event})

    event.node.req.on('close', () => console.log(`from close`));
    event.node.req.on('end', () => console.log(`from end`));
    event.node.req.on('error', () => console.log(`from error`));
    event.node.req.on('pause', () => console.log(`from pause`));

    event.node.req.addListener('close', () => console.log(`from close`));
    event.node.req.addListener('end', () => console.log(`from end`));
    event.node.req.addListener('error', () => console.log(`from error`));
    event.node.req.addListener('pause', () => console.log(`from pause`));


    await new Promise(() => {})

    // event.node.res.end();
    // const sseId = crypto.randomUUID();
    //
    // const sendEvent = (data) => {
    //     event.node.res.write(`id: ${sseId}\n`);
    //     event.node.res.write(`data: ${data}\n\n`);
    // };
    //
    // const sleep = (milliseconds) => {
    //     return new Promise((resolve) => setTimeout(resolve, milliseconds));
    // };
    //
    // let times = 10;
    //
    // for (let i = 0; i < times; i++) {
    //     const data = {date:new Date(), eventCount:i};
    //     sendEvent(JSON.stringify(data));
    //     await sleep(1000);
    // }
    //
    // sendEvent('[DONE]');
    // event.node.res.end();


})