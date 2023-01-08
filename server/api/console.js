import {EventEmitter} from 'node:events'

// todo 2 listeners перебивают друг друга?


const emitter = new EventEmitter()

const buffer = {
    data: [],
    isReady: true,
    timer: null,
    addData(text) {
        if (!listener.isActive) return
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
                    new Promise((resolve, reject) => emitter.once('newRequest',
                        () => reject(new Error('Received another request!')))),
                    new Promise((resolve, reject) => setTimeout(reject, 10000, new Error('Time is out!'))),
                    new Promise(resolve => emitter.once('dataReady', resolve))
                ])
            } catch (e) {
                if (e.message === 'Time is out!') return ''
                else throw createError({ statusCode: 504, statusMessage: e.message})
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
        this.timer = setTimeout(() => this.deactivate(), 180000)
    },
    deactivate() {
        this.isActive = false
        buffer.clearData()
    }
}

// let i = 0
// setInterval(() => {
//     buffer.addData(JSON.stringify(i))
//     i++
// }, 15000)

export default defineEventHandler(async (event) => {

    const data = await readBody(event)
    if (data) {
        buffer.addData(data)
        return true
    }

    if (emitter.listenerCount('newRequest')) { // висит предыдущий запрос
        emitter.emit('newRequest')
        await new Promise(resolve => setTimeout(resolve, 50)) // делаем паузу на завершение предыдущего запроса
    }

    listener.activate()

    event.node.req.on('close', () => {
        emitter.removeAllListeners('newRequest')
        emitter.removeAllListeners('dataReady')
    })

    return await buffer.getData()
})