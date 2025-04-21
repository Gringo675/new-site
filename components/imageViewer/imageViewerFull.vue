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
            class="text-gray-100"
          >
            При получении изображения произошла ошибка. Попробуйте перезагрузить страницу.
          </div>
          <div v-else-if="!item.load">Loading...</div>
          <img
            v-else
            @click.stop
            :src="item.full"
            class="max-h-full max-w-full shrink cursor-zoom-in overflow-auto object-contain transition-transform duration-500"
            draggable="false"
          />
        </template>

        <template #indicator="{ onClick, page, active }">
          <img
            @click.stop="onClick(page)"
            :src="images[page - 1].thumb"
            class="max-h-full max-w-[100px] min-w-5 shrink object-contain"
            :class="{
              'cursor-pointer border-2 border-red-700': !active,
              'cursor-default border-2 border-green-700': active,
            }"
            draggable="false"
          />
        </template>

        <template #prev="{ onClick, disabled }">
          <button
            type="button"
            :disabled="disabled"
            @click.stop="onClick"
            class="absolute top-1/2 left-3 inline-flex shrink-0 -translate-y-1/2 items-center rounded-full bg-slate-100 p-2 text-slate-600 opacity-60 hover:opacity-90 focus:outline-hidden focus-visible:outline-0 disabled:bg-slate-400 disabled:opacity-20"
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
            class="absolute top-1/2 right-3 inline-flex shrink-0 -translate-y-1/2 items-center rounded-full bg-slate-100 p-2 text-slate-600 opacity-60 hover:opacity-90 focus:outline-hidden focus-visible:outline-0 disabled:bg-slate-400 disabled:opacity-20"
          >
            <UIcon
              name="i-heroicons-chevron-right"
              class="h-10 w-10"
            />
          </button>
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
    /* transform: translate(400px, 400px) scale(0.3); */
  }
  100% {
    opacity: 1;
    transform: translate(0, 0) scale(1);
  }
}
@keyframes viewer-out {
  0% {
    opacity: 1;
    transform: translate(0, 0) scale(1);
  }
  100% {
    opacity: 0.5;
    transform: translate(var(--viewer-transition-x), var(--viewer-transition-y)) scale(var(--viewer-scale));
    /* transform: translate(200px, 200px) scale(0.5); */
  }
}
</style>
