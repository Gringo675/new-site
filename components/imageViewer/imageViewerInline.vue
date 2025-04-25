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

const carousel = ref(null)

const scrollToActiveImg = () => carousel.value.select(carousel.value.page)

onMounted(() => {
  const imageContainer = carousel.value.container
  // smooth scroll
  // imageContainer.addEventListener('pointerdown', event => {
  //   // Проверяем тип указателя
  //   if (event.pointerType === 'touch') {
  //     // Для тач-событий используем touchend
  //     imageContainer.addEventListener('touchend', scrollToActiveImg, { once: true })
  //     // p.s. тач-события устроены таким образом, что на изображении не будет клика, если было перемещение
  //   } else {
  //     // Для мыши используем pointer capture
  //     imageContainer.addEventListener(
  //       'pointermove',
  //       () => {
  //         imageContainer.setPointerCapture(event.pointerId) // это передаст все события от указателя на данный контейнер, вследствие чего на изображении не будет клика
  //         imageContainer.addEventListener('lostpointercapture', scrollToActiveImg, { once: true })
  //       },
  //       { once: true },
  //     )
  //   }
  // })
  // растягивание крайних изображений при перетаскивании
  // useViewerEdgeImg(imageContainer, carousel)
})

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
    ref="carousel"
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
