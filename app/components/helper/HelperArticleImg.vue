<script setup>
//
const props = defineProps({
  imgName: String,
  alt: String,
  class: { type: String, default: '' },
})
</script>

<template>
  <picture>
    <source
      type="image/avif"
      :srcset="`/static/img/articles/wmax_${imgName}.avif`" />
    <source
      type="image/webp"
      :srcset="`/static/img/articles/wmax_${imgName}.webp`" />
    <img
      :src="`/static/img/articles/wmax_${imgName}.jpg`"
      :alt="alt"
      loading="lazy"
      decoding="async"
      :class="class" />
  </picture>
</template>
