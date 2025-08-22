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

const images = props.products
  ? props.images.map(img => {
      return {
        full: productImagesDirectory + img,
        thumb: productImagesDirectory + 'thumb_' + img,
      }
    })
  : props.images

const carousel = useTemplateRef('carouselRef')

const showFullViewer = () => {
  const activeImgIndex = carousel.value.page - 1
  const fullImages = props.products
    ? props.images.map(img => {
        return {
          full: productImagesDirectory + 'full_' + img,
          thumb: productImagesDirectory + 'thumb_' + img,
        }
      })
    : props.images
  showImageViewer(fullImages, { activeImgIndex, causerId: 'img_' + activeImgIndex })
}
</script>

<template>
  <ImageViewerCarousel
    ref="carouselRef"
    :items="images"
  >
    <template #default="{ item, index }">
      <img
        :src="item.full ?? item"
        :id="'img_' + index"
        class="min-w-0 shrink cursor-zoom-in object-contain"
        draggable="false"
        @click="showFullViewer"
      />
    </template>
  </ImageViewerCarousel>
</template>
