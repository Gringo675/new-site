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
  // useViewerImgZoom(imageContainer)
  useViewerInitialScroll(props, imageContainer)
})

const imgZoom = {
  target: null,
  centerX: 0,
  centerY: 0,
  maxTranslateX: 0,
  maxTranslateY: 0,
  offsetX: 0,
  offsetY: 0,
  scale: 2,
}
const activateZoom = event => {
  console.log(`activateZoom`)
  imgZoom.target = event.target

  const imgCoords = imgZoom.target.getBoundingClientRect()
  imgZoom.centerX = imgCoords.left + imgCoords.width / 2
  imgZoom.centerY = imgCoords.top + imgCoords.height / 2
  imgZoom.maxTranslateX = Math.max((imgCoords.width * (imgZoom.scale - 1)) / 2 - imgCoords.left, 0)
  imgZoom.maxTranslateY = Math.max((imgCoords.height * (imgZoom.scale - 1)) / 2 - imgCoords.top, 0)
  imgZoom.offsetX = 0
  imgZoom.offsetY = 0

  imgZoom.target.style.cursor = 'zoom-out'
  imgZoom.target.style.zIndex = '10'
  imgZoom.target.addEventListener('mousemove', calculateZoom)

  window.addEventListener('click', deactivateZoom, { capture: true, once: true })
  // imgZoom.target.addEventListener('transitionend', cancelTransition, {
  //   once: true,
  // })
  // window.addEventListener('resize', deactivateZoom, { once: true })

  calculateZoom(event)
}
const calculateZoom = event => {
  console.log(`calculateZoom`)
  event.preventDefault()
  let translateX = imgZoom.centerX - event.clientX - imgZoom.offsetX
  if (translateX < -imgZoom.maxTranslateX) {
    imgZoom.offsetX = imgZoom.centerX + imgZoom.maxTranslateX - event.clientX
    translateX = -imgZoom.maxTranslateX
  } else if (translateX > imgZoom.maxTranslateX) {
    imgZoom.offsetX = imgZoom.centerX - imgZoom.maxTranslateX - event.clientX
    translateX = imgZoom.maxTranslateX
  }

  let translateY = imgZoom.centerY - event.clientY - imgZoom.offsetY
  if (translateY < -imgZoom.maxTranslateY) {
    imgZoom.offsetY = imgZoom.centerY + imgZoom.maxTranslateY - event.clientY
    translateY = -imgZoom.maxTranslateY
  } else if (translateY > imgZoom.maxTranslateY) {
    imgZoom.offsetY = imgZoom.centerY - imgZoom.maxTranslateY - event.clientY
    translateY = imgZoom.maxTranslateY
  }

  imgZoom.target.style.transform = `translate(${translateX}px, ${translateY}px) scale(${imgZoom.scale})`
  // console.log(`translateX: ${JSON.stringify(translateX, null, 2)}`)
  // console.log(`translateY: ${JSON.stringify(translateY, null, 2)}`)
}

const deactivateZoom = event => {
  console.log(`deactivateZoom`)
  event.stopPropagation()
  imgZoom.target.removeEventListener('mousemove', calculateZoom)
  // window.removeEventListener('mousedown', deactivateZoom, { capture: true })
  // imgZoom.target.removeEventListener('touchstart', onTouchStart)
  // imgZoom.target.removeEventListener('touchmove', onTouchMove)
  // imageContainer.removeEventListener('touchmove', onContainerTouchMove)
  // imgZoom.target.removeEventListener('transitionend', cancelTransition) // double-click protection
  imgZoom.target.style.removeProperty('transform')
  // imgZoom.target.style.removeProperty('transition')
  imgZoom.target.style.removeProperty('cursor')
  imgZoom.target.style.removeProperty('z-index')
  // delete imgZoom.target.dataset.zoomed
}
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
            @click.stop="activateZoom($event)"
            :src="item.full"
            class="max-h-full min-h-0 max-w-full min-w-0 shrink cursor-zoom-in transition-transform duration-500"
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
