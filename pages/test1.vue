<script setup>
const images = [
  'SHC1STIZ.jpg',
  'shc-i-stiz_1.jpg',
  'shc-i-stiz_2.jpg',
  'shc-i-stiz_3.jpg',
  'SHC1STIZ.jpg',
  'shc-i-stiz_1.jpg',
]
</script>

<template>
  <div class="viewer-box w-[500px] bg-blue-200">
    <ImageViewerModal :images="images" />
  </div>
</template>
