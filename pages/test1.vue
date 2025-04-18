<script setup>
//
definePageMeta({
  layout: 'empty',
})

const items = [
  'https://chelinstrument.ru/components/com_jshopping/files/img_products/shc-i-stiz_2.jpg',
  'https://chelinstrument.ru/components/com_jshopping/files/img_products/SHC1STIZ.jpg',
  'https://chelinstrument.ru/components/com_jshopping/files/img_products/shc-i-stiz_1.jpg',
  'https://chelinstrument.ru/components/com_jshopping/files/img_products/shc-i-stiz_3.jpg',
]
</script>

<template>
  <div class="m-4 bg-amber-300 p-4">
    <UCarousel
      v-slot="{ item }"
      arrows
      dots
      :items="items"
      class="mx-auto w-full max-w-xs"
    >
      <img
        :src="item"
        class="rounded-lg"
      />
    </UCarousel>
  </div>
</template>
