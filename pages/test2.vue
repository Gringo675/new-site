<script setup>
const images = [
  'SHC1STIZ.jpg',
  'shc-i-stiz_1.jpg',
  'shc-i-stiz_2.jpg',
  'shc-i-stiz_3.jpg',
  'SHC1STIZ.jpg',
  'shc-i-stiz_1.jpg',
  'shc-i-stiz_2.jpg',
  'shc-i-stiz_3.jpg',
]
</script>

<template>
  <div class="viewer-box w-[1200px] max-w-full bg-blue-200">
    <ImageViewerInline :images="images" />
  </div>
</template>
