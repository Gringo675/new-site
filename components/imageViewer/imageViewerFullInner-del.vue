<script setup>
/**
 * received [{full: 'path_to_full_image', thumb: 'path_to_thumb_image'}, ...] or ['path_to_image', ...]
 */
// const props = getImageViewerData()

const props = defineProps({
  images: Array,
  activeImgIndex: Number,
})

const carousel = ref(null)

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

onMounted(() => {
  const imageContainer = carousel.value.$el.firstElementChild
  useViewerEdgeImg(imageContainer, carousel)
  useViewerImgZoom(imageContainer)
  useViewerPreventClosingAndAnimateScroll(imageContainer, carousel)
  useViewerInitialScroll(props, imageContainer)
})
</script>

<template>
  <ImageViewerCarousel
    ref="carousel"
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
        class="max-h-full max-w-full shrink cursor-zoom-in overflow-auto border border-blue-700 object-contain transition-transform duration-500"
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
