<script setup>
//
const props = defineProps({
  images: Array,
  name: String,
})

// const images = props.images.map(img => {
//   return {
//     full: '/static/img/products/full_' + img,
//     thumb: '/static/img/products/thumb_' + img,
//   }
// })

const carousel = useTemplateRef('carouselRef')

const showFullViewer = () => {
  const activeImgIndex = carousel.value.page - 1
  showImageViewer(props.images, { activeImgIndex, causerId: 'img_' + activeImgIndex })
}
</script>

<template>
  <ImageViewerCarousel
    ref="carouselRef"
    :items="images">
    <template #default="{ item, index }">
      <picture class="flex items-center">
        <source
          type="image/avif"
          :srcset="`/static/img/products/w_400/${item}.avif`" />
        <source
          type="image/webp"
          :srcset="`/static/img/products/w_400/${item}.webp`" />
        <img
          :src="`/static/img/products/w_400/${item}.jpg`"
          :alt="name"
          loading="lazy"
          decoding="async"
          :id="'img_' + index"
          class="h-auto max-h-100 w-auto shrink cursor-zoom-in"
          draggable="false"
          @click="showFullViewer"
          width="400"
          height="400" />
      </picture>
    </template>
  </ImageViewerCarousel>
</template>
