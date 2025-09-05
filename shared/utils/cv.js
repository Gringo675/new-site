/**
 * example:
 * cv({var1, var2, var3})
 * for ref and reactive cv({var1}, {var2}, {var3})
 * cv('just text')
 * cv('some text', var1}
 */

export default (...args) => {
  let text = ''
  for (const arg of args) {
    if (typeof arg === 'object') {
      for (const key in arg) {
        const ifRef = typeof isRef === 'function' ? isRef(arg[key]) : false
        const ifReactive = typeof isReactive === 'function' ? isReactive(arg[key]) : false
        text += `${key}${ifRef ? '(Ref)' : ''}${ifReactive ? '(Reactive)' : ''}: ${JSON.stringify(
          ifRef ? arg[key].value : arg[key],
          null,
          2,
        )}
`
      }
    } else {
      text += `${arg}
`
    }
  }

  console.log(text)

  const isServer = import.meta.server ?? true // when call from /api it is undefined
  if (isServer) {
    $fetch('/api/console', {
      method: 'POST',
      body: { text }, // после обновления readBody перестал принимать строки, дополнительно заворачиваем в объект
    })
  }
}
