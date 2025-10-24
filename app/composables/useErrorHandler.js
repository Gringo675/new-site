export default () => {
  const router = useRouter()
  const user = useUser()

  onErrorCaptured(e => {
    handleError(e)
    return false
  })
  onMounted(() => {
    // Для ловли ошибок в промисах (ассинхронных функциях, вызываемых без await),
    // которые не отлавливаются стандартными способами
    window.addEventListener('unhandledrejection', event => {
      event.preventDefault()
      // console.warn(`UNHANDLED PROMISE REJECTION: ${event.reason}`)
      const error = createError({ statusCode: 465, statusMessage: `UNHANDLED PROMISE REJECTION: ${event.reason}` })
      handleError(error)
    })
  })
  const handleError = e => {
    if (e.name === 'FetchError') {
      // в FetchError нельзя ничего менять, поэтому заменяем её на "обычную" ошибку
      e = createError({
        statusCode: e.statusCode,
        statusMessage: e.statusMessage,
        stack: e.stack,
      })
    }
    e.statusCode = e.statusCode ?? 500
    e.statusMessage = e.statusMessage || e.message
    e.data = e.data ?? {}
    if (!e.data.path) {
      e.data.path = router.currentRoute.value.fullPath // useRoute returns incorrect res.
      e.data.onServer = import.meta.server
      setErrorToLog(e)
    }
    showError(e)
  }
  const setErrorToLog = async e => {
    // записываем ошибку в лог
    const errorForLog = {
      // Стандартные данные
      code: e.statusCode,
      message: e.statusMessage,
      stack: e.stack,
      path: e.data.path,
      onServer: e.data.onServer,

      // Новые обогащенные данные
      params: router.currentRoute.value.params,
      userId: user.value.id,
      userAgent: import.meta.client ? navigator.userAgent : 'N/A',
    }
    try {
      console.log(`writing error...`)
      await $fetch('/api/log/setError', {
        method: 'POST',
        body: errorForLog,
      })
    } catch (logError) {
      console.error(`Can't write error to the log: ${logError.message}`)
    }
  }
}
