<script setup>
//
const props = defineProps({
  images: Array,
  name: String,
})

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
      <picture class="flex aspect-2/3 w-75 max-w-full items-center">
        <source
          type="image/avif"
          :srcset="`/static/img/products/w_300/${item}.avif`" />
        <source
          type="image/webp"
          :srcset="`/static/img/products/w_300/${item}.webp`" />
        <img
          :src="`/static/img/products/w_300/${item}.jpg`"
          :alt="name"
          :fetchpriority="index === 0 ? 'high' : 'auto'"
          :loading="index === 0 ? 'eager' : 'lazy'"
          decoding="async"
          :id="'img_' + index"
          class="h-auto w-full shrink cursor-zoom-in"
          draggable="false"
          @click="showFullViewer"
          width="300"
          height="450" />
      </picture>
    </template>
  </ImageViewerCarousel>
</template>
