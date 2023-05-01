<script setup>

onErrorCaptured((e) => { // для ловли ошибок вне NuxtErrorBoundary
  console.log(`onErrorCaptured message: ${JSON.stringify(e.message, null, 2)}`)
  console.log(`onErrorCaptured stack: ${JSON.stringify(e.stack, null, 2)}`)
  showError(e)
  return false
})

const someErrorLogger = (e) => {
  console.log(`NuxtErrorBoundary caught error`)
  console.log(`e: ${JSON.stringify(e.message, null, 2)}`)
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
    </NuxtLayout>
    <ClientOnly>
      <LazyTheMessage />
      <LazyTheLoader />
      <LazyTheNotice />
      <LazyTheLogin />
    </ClientOnly>
  </div>
</template>
