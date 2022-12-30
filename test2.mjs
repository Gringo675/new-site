import { EventEmitter } from 'node:events'
const emitter = new EventEmitter()

const buffer = {
    data: [],
    isReady: true,
    timer: null,
    addData (text) {
        this.isReady = false
        clearTimeout(this.timer)
        this.data.push({
            time: new Date().toLocaleTimeString(),
            text
        })
        this.timer = setTimeout(() => {
            this.isReady = true
            emitter.emit('dataReady')
        }, 1000)
    },
    async getData () {
        if (!this.data.length || !this.isReady) {
            await new Promise((resolve) => {
                emitter.once('dataReady', () => resolve())
            })
        }
        const response = JSON.stringify(this.data)
        this.data.length = 0
        return response
    }
}

buffer.getData().then((data) => console.log(`data: ${JSON.stringify(data, null, 2)}`))