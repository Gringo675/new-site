<script setup>
import { corePlugins } from '#tailwind-config'

//
const props = defineProps({
  images: Array,
})
const imagesDirectory = 'https://chelinstrument.ru/components/com_jshopping/files/img_products/'
const viewer = ref()
// onMounted(async () => {
//   await new Promise((resolve, reject) => {
//     setTimeout(resolve, 1)
//   })
//   const page = viewer.value.page
//   console.log(`page: ${JSON.stringify(page, null, 2)}`)
//   viewer.value.select(3)
// })
const onClick = index => {
  // const page = viewer.value.page
  // console.log(`page: ${JSON.stringify(page, null, 2)}`)
  console.log(`index: ${JSON.stringify(index, null, 2)}`)
}
</script>

<template>
  <UCarousel
    ref="viewer"
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
    <template #default="{ item, index }">
      <img
        :src="imagesDirectory + item"
        class="border border-blue-700 w-min min-w-10 object-contain shrink"
        draggable="false"
        @click="onClick(index)"
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
