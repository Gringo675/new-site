/**
 * example:
 * cv({var1, var2, var3})
 * for ref and reactive cv({var1}, {var2}, {var3})
 * cv('just text')
 * cv('some text', var1}
 */

export default (...args) => {
  // на /api нет process.server, поэтому при запросах оттуда дописывается специальный ключ последним аргументом
  // также на /api недоступны isRef, isReactive
  const fromAPI = args[args.length - 1] === 'fromAPI'
  if (fromAPI) args.pop() // удаляем ключ

  let text = ''
  for (const arg of args) {
    if (typeof arg === 'object') {
      for (const key in arg) {
        const ifRef = fromAPI ? false : isRef(arg[key])
        const ifReactive = fromAPI ? false : isReactive(arg[key])
        text += `${key}${ifRef ? '(Ref)' : ''}${ifReactive ? '(Reactive)' : ''}: ${JSON.stringify(
          ifRef ? arg[key].value : arg[key],
          null,
          2
        )}\n`
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
      body: { text }, // после обновления readBody перестал принимать строки, дополнительно заворачиваем в объект
    })
  }
}
