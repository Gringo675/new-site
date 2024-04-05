<script setup>
definePageMeta({
  layout: 'empty',
})

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
const files = ['0.jpg', '1.jpg', '2.jpg', '3.jpg']
</script>

<template>
  <ImageViewerModal
    :images="images"
    :active-img-index="0"
  />
</template>
