<script setup>
//
const props = defineProps({
  images: Array || String,
})

const images = computed(() => (Array.isArray(props.images) ? props.images : [props.images]))

const imagesDirectory = 'https://chelinstrument.ru/components/com_jshopping/files/img_products/'

const carousel = ref(null)

const activateZoom = () => {
  const carouselRect = carousel.value.$el.getBoundingClientRect()
  showImageViewer(
    images,
    carousel.value.page - 1,
    carouselRect.x + carouselRect.width / 2 - window.innerWidth / 2,
    carouselRect.y + carouselRect.height / 2 - window.innerHeight / 2,
    carouselRect.width / window.innerWidth
  )
}
</script>

<template>
  <UCarousel
    ref="carousel"
    :items="images"
    :ui="{
      wrapper: 'p-2',
      item: 'basis-full justify-center p-2',
      indicators: {
        wrapper: 'relative bottom-0 mt-4 overflow-auto items-stretch bg-green-200',
      },
    }"
    :indicators="images.length > 1"
    :arrows="images.length > 1"
  >
    <template #default="{ item }">
      <img
        :src="imagesDirectory + item"
        class="border border-blue-700 w-min min-w-10 object-contain shrink cursor-zoom-in"
        draggable="false"
        @click="activateZoom"
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
