<script setup>
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
    e.data.path = useRouter().currentRoute.value.fullPath // useRoute returns incorrect res.
    e.data.onServer = import.meta.server
    // setErrorToLog(e)
  }
  // console.log(`e: ${JSON.stringify(e, null, 2)}`)
  showError(e)
}
const setErrorToLog = async e => {
  // записываем ошибку в лог
  const error = {
    code: e.statusCode,
    message: e.statusMessage,
    stack: e.stack,
    path: e.data.path,
    onServer: e.data.onServer,
  }
  try {
    await $fetch('/api/log/setError', {
      method: 'POST',
      body: error,
    })
  } catch (e) {
    console.error(`Can't write error to the log: ${e.message}`)
  }
}
</script>

<template>
  <UApp>
    <div class="flex min-h-screen flex-col">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </div>
  </UApp>
</template>
