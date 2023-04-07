/**
 * example:
 * cv({var1}, {var2}, {var3})
 * cv({var1, var2, var3})
 * cv('just text')
 * cv('some text', var1}
 */

export default (...args) => {

    // на /api/ нет process.server, поэтому при запросах оттуда дописывается специальный ключ последним аргументом
    const fromAPI = args[args.length - 1] === 'fromAPI'
    if (fromAPI) args.pop()  // удаляем ключ

    let text = ''
    for (const arg of args) {
        // const isRef = isRef(arg)
        // console.log(`isRef: ${JSON.stringify(isRef, null, 2)}`)
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
        $fetch('/api/console', {
            method: 'POST',
            body: text
        })
    }
}