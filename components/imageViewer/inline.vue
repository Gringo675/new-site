<script setup>
//
const props = defineProps({
  images: Array,
})
const imagesDirectory = 'https://chelinstrument.ru/components/com_jshopping/files/img_products/'
</script>

<template>
  <UCarousel
    :items="images"
    :ui="{
      item: 'basis-full justify-center p-2',
      indicators: {
        wrapper: 'relative bottom-0 mt-4 overflow-auto items-stretch bg-green-200',
      },
    }"
    :indicators="props.images.length > 1"
    class="p-2"
  >
    <template #default="{ item }">
      <img
        :src="imagesDirectory + item"
        class="border border-blue-700 w-min min-w-10 object-contain shrink"
        draggable="false"
      />
    </template>

    <template #indicator="{ onClick, page, active }">
      <img
        :src="`${imagesDirectory}thumb_${images[page - 1]}`"
        class="max-w-[100px] min-w-5 shrink object-contain"
        :class="{ 'cursor-pointer border border-red-700': !active, 'cursor-default border border-green-700': active }"
        draggable="false"
        @click="onClick(page)"
      />
    </template>
  </UCarousel>
</template>
