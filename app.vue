<script setup>
onErrorCaptured(e => {
  // для ловли ошибок вне NuxtErrorBoundary
  console.log(`onErrorCaptured message: ${JSON.stringify(e.message, null, 2)}`)
  console.log(`onErrorCaptured stack: ${JSON.stringify(e.stack, null, 2)}`)
  showError(e)
  return false
})
// onMounted(() => {
//   // Для ловли ошибок в промисах (ассинхронных функциях, вызываемых без await),
//   // которые не отлавливаются стандартными способами
//   window.addEventListener('unhandledrejection', event => {
//     event.preventDefault()
//     console.warn(`UNHANDLED PROMISE REJECTION: ${event.reason}`)
//     showError({ statusCode: 465, statusMessage: `UNHANDLED PROMISE REJECTION: ${event.reason}` })
//     // console.log('Unhandled rejection (promise: ', event.promise, ', reason: ', event.reason, ').')
//   })
// })

const someErrorLogger = e => {
  // логгер должен быть в TheError, наверно
  console.log(`NuxtErrorBoundary caught error`)
  console.log(`e: ${JSON.stringify(e.message, null, 2)}`)
  console.log(`stack: ${JSON.stringify(e.stack, null, 2)}`)
}
</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtErrorBoundary @error="someErrorLogger">
        <NuxtPage />
        <template #error="{ error }">
          <TheError :error="error" />
        </template>
      </NuxtErrorBoundary>
      <HelperClientComponents />
    </NuxtLayout>
  </div>
</template>
