import { PassThrough } from 'node:stream'

const tunnel = new PassThrough();

tunnel.on("data", (chunk) => {
    console.log("bytes:", chunk.toString())
});

tunnel.write('Some text')