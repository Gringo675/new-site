<script setup>
/**
 * todo:
 * z-index on zoomed image (upper than arrows)
 * transition from causer
 * concat with modal.vue
 * arrows style
 */

definePageMeta({
  layout: 'empty',
})

const isOpen = ref(false)

onMounted(() => {
  setTimeout(() => {
    isOpen.value = true
  }, 100)
  setTimeout(onCarouselMounted, 1000)
})

const files = [
  'shc-i-stiz_1.jpg',
  'SHC1STIZ.jpg',
  'shc-i-stiz_2.jpg',
  'shc-i-stiz_3.jpg',
  'SHC1STIZ.jpg',
  'shc-i-stiz_1.jpg',
  'shc-i-stiz_2.jpg',
  'shc-i-stiz_3.jpg',
]
const imagesDirectory = 'https://chelinstrument.ru/components/com_jshopping/files/img_products/'

const carousel = ref(null)
let imageContainer = null
const onCarouselMounted = () => {
  console.log(`from onCarouselMounted`)
  imageContainer = carousel.value.$el.firstElementChild
  useViewerEdgeImg(imageContainer, carousel, files.length)
  useViewerImgZoom(imageContainer)
  imageContainer.addEventListener('mousedown', event => {
    imageContainer.addEventListener('mousemove', preventClosingAndAnimateScroll, { once: true })
    window.addEventListener(
      'mouseup',
      () => imageContainer.removeEventListener('mousemove', preventClosingAndAnimateScroll),
      {
        once: true,
      }
    )
  })

  // smooth scroll for touch
  imageContainer.addEventListener('touchstart', event => {
    imageContainer.style.scrollSnapType = 'x mandatory'
  })
}
const preventClosingAndAnimateScroll = () => {
  window.addEventListener('click', event => event.stopPropagation(), { capture: true, once: true })
  window.addEventListener(
    'mouseup',
    () => {
      console.log(`animate mouse scrolling`)
      // todo: check if state.zooming?
      carousel.value.select(carousel.value.page)
    },
    { once: true }
  )
}
const onCarouselClick = () => {
  // isOpen.value = false
  console.log(`carousel closed`)
}
</script>

<template>
  <div>
    <UButton
      label="Open"
      @click="isOpen = true"
    />

    <UModal
      v-model="isOpen"
      fullscreen
      :ui="{
        wrapper: 'm_wrapper z-30',
        inner: 'm_inner ',
        container: 'm_container ',
        base: 'm_base items-center',
        background: '',
        overlay: {
          background: 'bg-gray-800/75',
        },
      }"
    >
      <UCarousel
        ref="carousel"
        @click="onCarouselClick"
        :items="files"
        :ui="{
          wrapper: 'c_wrapper w-screen h-screen flex flex-col',
          container: 'c_container relative items-center flex-1 bg-yellow-200 snap-none',
          item: 'c_item snap-always basis-full justify-center h-full items-center p-2',
          indicators: {
            wrapper: 'i_wrapper relative max-h-[20vh] bottom-0 p-2 nrw:hidden bg-green-200',
          },
          arrows: {
            wrapper: 'absolute top-1/2 -translate-y-1/2 w-full pointer-events-none ',
          },
        }"
        indicators
        arrows
      >
        <template #default="{ item }">
          <img
            @click.stop
            :src="`${imagesDirectory}full_${item}`"
            class="border border-blue-700 object-contain max-h-full max-w-full shrink overflow-auto transition-transform duration-500 cursor-zoom-in"
            draggable="false"
          />
        </template>

        <template #indicator="{ onClick, page, active }">
          <img
            @click.stop="onClick(page)"
            :src="`${imagesDirectory}thumb_${files[page - 1]}`"
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
            class="pointer-events-auto text-blue-400"
            :class="{ 'text-gray-400': disabled }"
            :disabled="disabled"
            @click.stop="onClick"
          >
            Prev
          </button>
        </template>

        <template #next="{ onClick, disabled }">
          <button
            class="pointer-events-auto text-blue-400"
            :class="{ 'text-gray-400': disabled }"
            :disabled="disabled"
            @click.stop="onClick"
          >
            Next
          </button>
        </template>
      </UCarousel>
    </UModal>
  </div>
</template>
