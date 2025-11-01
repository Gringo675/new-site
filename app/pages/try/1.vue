<script setup>
//
const aaa = 123
onMounted(() => {
  console.log(`here`)
  setTimeout(() => {
    preloadComponents(['CatsMenuSlider'])
  }, 5000)
  // import('~/components/TheTest.vue')
})
</script>

<template>
  <div>
    <h1>Try page 1</h1>
    <div class="h-200 w-100 bg-red-500"></div>
    <LazyTheTest hydrate-on-visible />
  </div>
</template>
