<script setup>
//
definePageMeta({
  layout: 'empty',
})
const items = [
  'https://picsum.photos/640/640?random=1',
  'https://picsum.photos/480/640?random=2',
  'https://picsum.photos/640/640?random=3',
  'https://picsum.photos/480/640?random=4',
  'https://picsum.photos/640/640?random=5',
  'https://picsum.photos/640/640?random=6',
]
</script>

<template>
  <UCarousel
    v-slot="{ item }"
    arrows
    auto-height
    :items="items"
    class="mx-auto w-full max-w-xs"
  >
    <img
      :src="item"
      class="h-full max-h-[300px] w-auto rounded-lg"
    />
  </UCarousel>
</template>
