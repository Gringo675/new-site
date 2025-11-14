export default async () => {
  //
  onErrorCaptured(e => {
    // without this all vue errors considered unhandled, so 'unhandledrejection' will catch them too
    showError(e)
    return false
  })
  onMounted(() => {
    // Для ловли ошибок в промисах (ассинхронных функциях, вызываемых без await),
    // которые не отлавливаются стандартными способами
    window.addEventListener('unhandledrejection', event => {
      event.preventDefault()
      // console.warn(`UNHANDLED PROMISE REJECTION: ${event.reason}`)
      const error = createError({ statusCode: 465, statusMessage: `UNHANDLED PROMISE REJECTION: ${event.reason}` })
      // handleError(error)
      showError(error)
    })
  })
}
