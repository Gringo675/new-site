export default (...args) => {

    // на /api/ нет process.server, поэтому при запросах оттуда дописывается специальный ключ последним аргументом
    const fromAPI = args[args.length - 1] === 'fromAPI'
    if (fromAPI) args.pop()  // удаляем ключ

    let text = ''
    for (const arg of args) {
        if (typeof arg === 'object') {
            for (const key in arg) {
                // console.log(`${key}: ${JSON.stringify(arg[key], null, 2)}`)
                text += `${key}: ${JSON.stringify(arg[key], null, 2)}\n`
            }
        } else {
            // console.log(arg)
            text += `${arg}\n`
        }
    }
    console.log(text)

    if (process.server || fromAPI) {
        process.cvStream.write(`event: cv\ndata: ${JSON.stringify(text)}\n\n`)
    }
}