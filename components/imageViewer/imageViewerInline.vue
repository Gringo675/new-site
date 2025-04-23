<script setup>
//
const props = defineProps({
  images: Array,
  products: {
    type: Boolean,
    default: true,
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
  const imageContainer = carousel.value.container
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
  const images = props.products
    ? props.images.map(img => {
        return {
          full: productImagesDirectory + 'full_' + img,
          thumb: productImagesDirectory + 'thumb_' + img,
        }
      })
    : props.images
  showImageViewer(images, { activeImgIndex, causerId: 'img_' + activeImgIndex })
}
</script>

<template>
  <ImageViewerCarousel
    ref="carousel"
    :items="images"
  >
    <template #default="{ item, index }">
      <img
        :src="products ? productImagesDirectory + item : item"
        :id="'img_' + index"
        class="min-w-0 shrink cursor-zoom-in object-contain"
        draggable="false"
        @click="showFullViewer"
      />
    </template>

    <template #indicator="{ onClick, page, active }">
      <img
        :src="products ? `${productImagesDirectory}thumb_${images[page - 1]}` : `${images[page - 1]}`"
        class="max-w-25 min-w-5 rounded"
        :class="[active ? 'cursor-default ring-2 ring-violet-700/70' : 'cursor-pointer']"
        draggable="false"
        @click="onClick(page)"
      />
    </template>
  </ImageViewerCarousel>
</template>
