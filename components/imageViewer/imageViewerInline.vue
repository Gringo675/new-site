<script setup>
//
const props = defineProps({
  images: Array,
  lite: {
    type: Boolean,
    default: false,
  },
})

const productImagesDirectory = useRuntimeConfig().public.IMAGES_DIRECTORY + 'img_products/'

const carousel = ref(null)

onMounted(() => {
  carousel.value.$el.addEventListener('mousedown', event => {
    if (event.target.tagName === 'IMG') {
      window.addEventListener('mousemove', preventImgClick, { once: true })
      window.addEventListener('mouseup', () => {
        window.removeEventListener('mousemove', preventImgClick)
      })
    }
  })
  // animate scroll (убрал "стандартную" дерганную анимацию через container: 'snap-none')
  const imageContainer = carousel.value.$el.firstElementChild
  imageContainer.addEventListener('mousedown', () => {
    window.addEventListener(
      'mouseup',
      () => {
        carousel.value.select(carousel.value.page)
      },
      { once: true },
    )
  })
  // smooth scroll for touch
  imageContainer.addEventListener('touchstart', () => {
    imageContainer.style.scrollSnapType = 'x mandatory'
  })
  // растягивание крайних изображений при перетаскивании
  useViewerEdgeImg(imageContainer, carousel)
})
const preventImgClick = () => {
  window.addEventListener(
    'click',
    event => {
      event.stopPropagation()
    },
    { capture: true, once: true },
  )
}
const showFullViewer = () => {
  const activeImgIndex = carousel.value.page - 1
  const images = props.images.map(img => {
    return {
      full: productImagesDirectory + 'full_' + img,
      thumb: productImagesDirectory + 'thumb_' + img,
    }
  })
  showImageViewer(images, { activeImgIndex, causerId: 'img_' + activeImgIndex })
}
</script>

<template>
  <ImageViewerCarousel
    ref="carousel"
    :items="images"
    :ui="{
      wrapper: 'p-2',
      container: 'snap-none',
      item: 'basis-full justify-center p-2',
      indicators: {
        wrapper: lite
          ? 'absolute bottom-4 w-min m-auto p-2'
          : 'relative bottom-0 mt-4 overflow-auto items-stretch bg-green-200',
      },
      arrows: {
        wrapper: '',
      },
    }"
    :indicators="images.length > 1"
    :arrows="!lite && images.length > 1"
    class="select-none"
  >
    <template #default="{ item, index }">
      <img
        :src="productImagesDirectory + item"
        :id="'img_' + index"
        class="w-min min-w-10 shrink cursor-zoom-in border border-blue-700 object-contain"
        draggable="false"
        @click="showFullViewer"
      />
    </template>

    <template #indicator="{ onClick, page, active }">
      <button
        v-if="lite"
        class="bg-opacity-70 h-4 w-4 rounded-full border-2 border-slate-500"
        :class="{
          'cursor-default bg-slate-500': active,
        }"
        @click="onClick(page)"
      ></button>
      <img
        v-else
        :src="`${productImagesDirectory}thumb_${images[page - 1]}`"
        class="max-w-[100px] min-w-5 shrink object-contain"
        :class="{ 'cursor-pointer border border-red-700': !active, 'cursor-default border border-green-700': active }"
        draggable="false"
        @click="onClick(page)"
      />
    </template>

    <template #prev="{ onClick, disabled }">
      <button
        type="button"
        :disabled="disabled"
        @click.stop="onClick"
        class="absolute top-1/2 left-3 inline-flex shrink-0 -translate-y-1/2 items-center rounded-full bg-slate-100 p-2 text-slate-600 opacity-60 hover:opacity-90 focus:outline-hidden focus-visible:outline-0 disabled:opacity-10"
      >
        <UIcon
          name="i-heroicons-chevron-left"
          class="h-10 w-10"
        />
      </button>
    </template>

    <template #next="{ onClick, disabled }">
      <button
        type="button"
        :disabled="disabled"
        @click.stop="onClick"
        class="absolute top-1/2 right-3 inline-flex shrink-0 -translate-y-1/2 items-center rounded-full bg-slate-100 p-2 text-slate-600 opacity-60 hover:opacity-90 focus:outline-hidden focus-visible:outline-0 disabled:opacity-10"
      >
        <UIcon
          name="i-heroicons-chevron-right"
          class="h-10 w-10"
        />
      </button>
    </template>
  </ImageViewerCarousel>
</template>
