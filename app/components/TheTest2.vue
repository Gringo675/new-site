<script setup>
//
const props = defineProps({
  images: Array,
})

const productImagesDirectory = useRuntimeConfig().public.IMAGES_DIRECTORY + 'img_products/'

const items = props.images.map(img => {
  return productImagesDirectory + img
})
console.log(`items: ${JSON.stringify(items, null, 2)}`)
</script>

<template>
  <UCarousel
    v-slot="{ item }"
    :items="items"
    class="mx-auto w-full max-w-xs"
  >
    <img
      :src="item"
      width="320"
      height="320"
      class="rounded-lg"
    />
  </UCarousel>
</template>
