<script setup>
//
useErrorHandler()
useDefaultMetaTags()

onMounted(() => {
  // prepare data for cats menu slider
  setTimeout(() => {
    preloadComponents(['CatsMenuSlider'])
  }, 5000)
})
</script>

<template>
  <HelperApp>
    <NuxtPage />
  </HelperApp>
</template>
