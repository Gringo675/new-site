<script setup>
//
const props = defineProps({
  images: Array,
  activeImgIndex: Number,
  causerId: String,
})

const emit = defineEmits(['close'])
const closeImageViewer = () => {
  emit('close')
}

const carousel = useTemplateRef('carouselRef')

// const images = reactive(
//   props.images.map(img => {
//     return {
//       full: img.full || img,
//       thumb: img.thumb || img,
//       load: false,
//       error: false,
//     }
//   }),
// )

const setAppearDisappearAnimation = () => {
  if (!props.causerId) return
  const causer = document.getElementById(props.causerId)
  if (!causer) return
  const causerCoords = causer.getBoundingClientRect()
  const viewportWidth = document.documentElement.clientWidth
  const viewportHeight = document.documentElement.clientHeight
  document.body.style.setProperty(
    '--viewer-transition-x',
    `${Math.round(causerCoords.x + causerCoords.width / 2 - viewportWidth / 2)}px`,
  )
  document.body.style.setProperty(
    '--viewer-transition-y',
    `${Math.round(causerCoords.y + causerCoords.height / 2 - viewportHeight / 2)}px`,
  )
  document.body.style.setProperty('--viewer-scale', `${Math.round((causerCoords.width * 100) / viewportWidth) / 100}`)

  onBeforeUnmount(() => {
    document.body.style.removeProperty('--viewer-transition-x')
    document.body.style.removeProperty('--viewer-transition-y')
    document.body.style.removeProperty('--viewer-scale')
  })
}
setAppearDisappearAnimation()

useViewerKeyPress(carousel)
// useViewerImgLoad(images, props.activeImgIndex, carousel)

const activateZoom = useViewerZoom

onMounted(async () => {
  await nextTick()
  const imageContainer = carousel.value.container
  carousel.value.$el.addEventListener('click', closeImageViewer)
  useViewerInitialScroll(props, imageContainer)
})
</script>

<template>
  <UModal
    title="viewer"
    description="viewer"
    fullscreen
    :transition="false"
    :ui="{
      overlay: 'bg-transparent',
      content:
        'bg-gray-900/90 data-[state=closed]:animate-[viewer-out_400ms_linear] data-[state=open]:animate-[viewer-in_400ms_linear] divide-none',
    }">
    <template #content>
      <UButton
        class="absolute top-3 right-3 z-10 focus-visible:ring-0 focus-visible:outline-none"
        icon="i-heroicons-x-circle"
        variant="link"
        :ui="{
          leadingIcon: 'size-8 sm:size-10',
        }"
        @click="closeImageViewer" />
      <ImageViewerCarousel
        ref="carouselRef"
        :items="images"
        fullScreen>
        <template #default="{ item, index }">
          <picture class="flex h-full w-full items-center justify-center">
            <source
              type="image/avif"
              :srcset="`/static/img/products/w_max/${item}.avif`" />
            <source
              type="image/webp"
              :srcset="`/static/img/products/w_max/${item}.webp`" />
            <img
              :src="`/static/img/products/w_max/${item}.jpg`"
              alt="Фото товара"
              :loading="index === activeImgIndex ? 'eager' : 'lazy'"
              :decoding="index === activeImgIndex ? 'sync' : 'async'"
              class="h-auto max-h-full min-h-0 w-auto max-w-full min-w-0 shrink cursor-zoom-in transition-transform duration-500"
              draggable="false"
              @click.stop="activateZoom($event)" />
          </picture>
        </template>
      </ImageViewerCarousel>
    </template>
  </UModal>
</template>

<style>
@keyframes viewer-in {
  0% {
    opacity: 0;
    transform: translate(var(--viewer-transition-x), var(--viewer-transition-y)) scale(var(--viewer-scale));
  }
}
@keyframes viewer-out {
  to {
    opacity: 0.5;
    transform: translate(var(--viewer-transition-x), var(--viewer-transition-y)) scale(var(--viewer-scale));
  }
}
</style>
