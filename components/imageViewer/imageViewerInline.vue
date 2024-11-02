<script setup>
//
const config = useRuntimeConfig()
const props = defineProps({
  images: [Array, String],
  lite: {
    type: Boolean,
    default: false,
  },
})

const images = Array.isArray(props.images) ? props.images : [props.images]

const imagesDirectory = config.public.IMAGES_DIRECTORY

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
      { once: true }
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
    { capture: true, once: true }
  )
}
const showFullViewer = () => {
  const carouselRect = carousel.value.$el.getBoundingClientRect()
  showImageViewer(
    images,
    carousel.value.page - 1,
    Math.round(carouselRect.x + carouselRect.width / 2 - window.innerWidth / 2),
    Math.round(carouselRect.y + carouselRect.height / 2 - window.innerHeight / 2),
    Math.round((carouselRect.width * 100) / window.innerWidth) / 100
  )
}
</script>

<template>
  <UCarousel
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
  >
    <template #default="{ item }">
      <img
        :src="imagesDirectory + item"
        class="border border-blue-700 w-min min-w-10 object-contain shrink cursor-zoom-in"
        draggable="false"
        @click="showFullViewer"
      />
    </template>

    <template #indicator="{ onClick, page, active }">
      <button
        v-if="lite"
        class="rounded-full h-4 w-4 border-2 border-slate-500 bg-opacity-70"
        :class="{
          'bg-slate-500 cursor-default': active,
        }"
        @click="onClick(page)"
      ></button>
      <img
        v-else
        :src="`${imagesDirectory}thumb_${images[page - 1]}`"
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
        class="absolute top-1/2 -translate-y-1/2 rounded-full p-2 left-3 text-slate-600 bg-slate-100 opacity-60 inline-flex items-center flex-shrink-0 hover:opacity-90 focus:outline-none focus-visible:outline-0 disabled:opacity-10"
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
        class="absolute top-1/2 -translate-y-1/2 rounded-full p-2 right-3 text-slate-600 bg-slate-100 opacity-60 inline-flex items-center flex-shrink-0 hover:opacity-90 focus:outline-none focus-visible:outline-0 disabled:opacity-10"
      >
        <UIcon
          name="i-heroicons-chevron-right"
          class="h-10 w-10"
        />
      </button>
    </template>
  </UCarousel>
</template>
