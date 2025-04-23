<script setup>
// изображения приходят в формате [{full: 'path_to_full_image', thumb: 'path_to_thumb_image'}, ...] или ['path_to_image', ...]

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

const images = reactive(
  props.images.map(img => {
    return {
      full: img.full || img,
      thumb: img.thumb || img,
      load: false,
      error: false,
    }
  }),
)

const setAnimation = () => {
  if (!props.causerId) return
  const causer = document.getElementById(props.causerId)
  if (!causer) return
  const causerCoords = causer.getBoundingClientRect()

  document.body.style.setProperty(
    '--viewer-transition-x',
    `${Math.round(causerCoords.x + causerCoords.width / 2 - window.innerWidth / 2)}px`,
  )
  document.body.style.setProperty(
    '--viewer-transition-y',
    `${Math.round(causerCoords.y + causerCoords.height / 2 - window.innerHeight / 2)}px`,
  )
  document.body.style.setProperty(
    '--viewer-scale',
    `${Math.round((causerCoords.width * 100) / window.innerWidth) / 100}`,
  )

  onBeforeUnmount(() => {
    document.body.style.removeProperty('--viewer-transition-x')
    document.body.style.removeProperty('--viewer-transition-y')
    document.body.style.removeProperty('--viewer-scale')
  })
}
setAnimation()

useViewerKeyPress(carousel)
useViewerImgLoad(images, props.activeImgIndex, carousel)

onMounted(async () => {
  await nextTick()
  const imageContainer = carousel.value.container
  carousel.value.$el.addEventListener('click', closeImageViewer)
  useViewerEdgeImg(imageContainer, carousel)
  useViewerImgZoom(imageContainer)
  useViewerPreventClosingAndAnimateScroll(imageContainer, carousel)
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
    }"
  >
    <template #content>
      <UButton
        class="absolute top-3 right-3 z-10 focus-visible:ring-0 focus-visible:outline-none"
        icon="i-heroicons-x-circle"
        variant="link"
        :ui="{
          leadingIcon: 'size-8 sm:size-10',
        }"
        @click="closeImageViewer"
      />
      <ImageViewerCarousel
        ref="carouselRef"
        :items="images"
        :indicators="images.length > 1"
        :arrows="images.length > 1"
        fullScreen
      >
        <template #default="{ item }">
          <div
            v-if="item.error"
            class="max-w-xs rounded-md border border-red-400 p-2 text-center text-gray-100"
          >
            При получении изображения произошла ошибка! Попробуйте перезагрузить страницу.
          </div>
          <div
            v-else-if="!item.load"
            class="size-10 animate-ping rounded-full bg-sky-400"
          ></div>
          <img
            v-else
            @click.stop
            :src="item.full"
            class="max-h-full min-h-0 max-w-full min-w-0 shrink cursor-zoom-in transition-transform duration-500"
            draggable="false"
          />
        </template>

        <template #indicator="{ onClick, page, active }">
          <img
            @click.stop="onClick(page)"
            :src="images[page - 1].thumb"
            class="max-h-full max-w-25 min-w-5 rounded"
            :class="[active ? 'cursor-default ring-2 ring-violet-700/70' : 'cursor-pointer']"
            draggable="false"
          />
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
