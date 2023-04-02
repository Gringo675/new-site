<script setup>

onErrorCaptured((e) => { // для ловли ошибок вне NuxtErrorBoundary
  // console.log(`onErrorCaptured error: ${JSON.stringify(e, null, 2)}`)
  showError(e)
  return false
})

const someErrorLogger = (e) => {
  console.log(`NuxtErrorBoundary caught error`)
  console.log(`e: ${JSON.stringify(e, null, 2)}`)
}

</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtErrorBoundary @error="someErrorLogger">
        <NuxtPage/>
        <template #error="{ error }">
          <TheError :error="error"/>
        </template>
      </NuxtErrorBoundary>
    </NuxtLayout>
    <ClientOnly>
      <LazyTheMessage/>
      <LazyTheLoader/>
      <LazyTheNotice/>
      <LazyTheLogin/>
    </ClientOnly>
  </div>
</template>
