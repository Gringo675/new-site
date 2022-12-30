import {EventEmitter} from 'node:events'
// todo isConsoleEnabled
// todo test buffer.addData debounce
// todo frontend (+ data format)
// todo set data through POST

const emitter = new EventEmitter()

const buffer = {
    data: [],
    isReady: true,
    timer: null,
    addData(text) {
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
    async getData() {
        if (!this.data.length || !this.isReady) { // если данных нет, начинаем гонку промисов
            try {
                await Promise.race([
                    new Promise((resolve, reject) => emitter.once('newRequest', () => reject(new Error('New request!')))),
                    new Promise((resolve, reject) => setTimeout(reject, 10000, new Error('Time is out!'))),
                    new Promise(resolve => emitter.once('dataReady', resolve))
                ])
            } catch (e) {
                return []
            }
        }
        const data = JSON.stringify(this.data)
        this.data.length = 0
        return data
    },
    clearData() {
        clearTimeout(this.timer)
        this.data.length = 0
        this.isReady = false
    }
}

const listener = {
    isActive: false,
    timer: null,
    activate() {
        clearTimeout(this.timer)
        this.isActive = true
    },
    deactivate() {
        this.timer = setTimeout(() => {
            this.isActive = false
            buffer.clearData()
        }, 30000)
    }
}

let i = 0
setInterval(() => {
    buffer.addData(JSON.stringify(i))
    i++
}, 15000)

export default defineEventHandler(async (event) => {

    listener.activate()

    emitter.emit('newRequest')
    await new Promise(resolve => setTimeout(resolve, 50)) // делаем паузу на завершение предыдущего запроса

    event.node.req.on('close', () => {
        emitter.removeAllListeners('newRequest')
        emitter.removeAllListeners('dataReady')
        listener.deactivate() // wrong !!!!!
        console.log(`from close`)
        console.log(`emitter.listenerCount('newRequest'): ${JSON.stringify(emitter.listenerCount('newRequest'), null, 2)}`)
        console.log(`emitter.listenerCount('dataReady'): ${JSON.stringify(emitter.listenerCount('dataReady'), null, 2)}`)

    })

    return await buffer.getData()
})