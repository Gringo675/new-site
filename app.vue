<script setup>

onErrorCaptured((e) => {
  console.log(`from onErrorCaptured`)
  // console.log(`onErrorCaptured error: ${JSON.stringify(error, null, 2)}`)
  showError(e)
  return false
})


</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtPage/>
    </NuxtLayout>
    <ClientOnly>
      <TheMessage/>
      <TheLoader/>
      <TheNotice/>
      <TheLogin/>
    </ClientOnly>
  </div>
</template>
