<script setup>
//
const config = useRuntimeConfig()
const viewerData = getImageViewerData()

const carousel = ref(null)
const imagesDirectory = config.public.IMAGES_DIRECTORY
// const imagesDirectory = 'https://test.chelinstrument.ru/images/test/'

const images = reactive(
  viewerData.images.map(img => {
    return {
      name: img,
      load: false,
      error: false,
    }
  })
)

useViewerKeyPress(carousel)
useViewerImgLoad(images, carousel, imagesDirectory)

onMounted(() => {
  const imageContainer = carousel.value.$el.firstElementChild
  useViewerEdgeImg(imageContainer, carousel)
  useViewerImgZoom(imageContainer)
  useViewerPreventClosingAndAnimateScroll(imageContainer, carousel)
  useViewerInitialScroll(imageContainer)
})
</script>

<template>
  <UCarousel
    ref="carousel"
    :items="images"
    :ui="{
      wrapper: 'c_wrapper w-screen h-screen flex flex-col',
      container: 'c_container relative items-center flex-1  snap-none',
      item: 'c_item snap-always basis-full justify-center h-full items-center p-2',
      indicators: {
        wrapper: 'i_wrapper relative max-h-[20vh] bottom-0 p-2 nrw:hidden bg-green-200',
      },
      arrows: {
        wrapper: '',
      },
    }"
    :indicators="images.length > 1"
    :arrows="images.length > 1"
  >
    <template #default="{ item }">
      <div
        v-if="item.error"
        class=""
      >
        При загрузке изображения произошла ошибка. Попробуйте перезагрузить страницу.
      </div>
      <div v-else-if="!item.load">Loading...</div>
      <img
        v-else
        @click.stop
        :src="`${imagesDirectory}full_${item.name}`"
        class="border border-blue-700 object-contain max-h-full max-w-full shrink overflow-auto transition-transform duration-500 cursor-zoom-in"
        draggable="false"
      />
    </template>

    <template #indicator="{ onClick, page, active }">
      <img
        @click.stop="onClick(page)"
        :src="`${imagesDirectory}thumb_${viewerData.images[page - 1]}`"
        class="max-w-[100px] max-h-full min-w-5 shrink object-contain"
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
        class="absolute top-1/2 -translate-y-1/2 rounded-full p-2 left-3 text-slate-600 bg-slate-100 opacity-60 inline-flex items-center flex-shrink-0 hover:opacity-90 focus:outline-none focus-visible:outline-0 disabled:opacity-20 disabled:bg-slate-400"
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
        class="absolute top-1/2 -translate-y-1/2 rounded-full p-2 right-3 text-slate-600 bg-slate-100 opacity-60 inline-flex items-center flex-shrink-0 hover:opacity-90 focus:outline-none focus-visible:outline-0 disabled:opacity-20 disabled:bg-slate-400"
      >
        <UIcon
          name="i-heroicons-chevron-right"
          class="h-10 w-10"
        />
      </button>
    </template>
  </UCarousel>
</template>
