<script setup>
definePageMeta({
  layout: 'empty',
})

const isOpen = ref(false)

onMounted(() => {
  setTimeout(() => {
    isOpen.value = true
  }, 1000)
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

// обрабатываем клики и перемещение
let notClose = false
let imgDrag = false
const onCarouselMouseUp = () => {
  if (!notClose) isOpen.value = false
  // if (!notClose) console.log(`carousel closed`)
}
const imgZoom = { active: false, initialX: 0, initialY: 0, translateX: 0, translateY: 0, scale: 2 }
const onImageMouseUp = event => {
  notClose = true
  if (!imgDrag) {
    imgZoom.active = !imgZoom.active
    const imgBlock = event.target
    if (imgZoom.active) {
      // todo: выход за границы(event.target)?, начальный транслейт, границы контейнера,оптимизация
      imgZoom.initialX = event.pageX
      imgZoom.initialY = event.pageY

      // temporary
      imgZoom.translateX = 200
      imgZoom.translateY = 400

      const imgContainer = imgBlock.parentElement.parentElement
      imgContainer.style.border = '1px solid red'
      window.addEventListener('mousemove', onZoomMouseMove)
      imgBlock.addEventListener('transitionend', () => (imgBlock.style.transition = 'none'), { once: true })
      imgBlock.style = `transform: translate(${imgZoom.translateX}px, ${imgZoom.translateY}px) scale(${imgZoom.scale})`
    } else {
      window.removeEventListener('mousemove', onZoomMouseMove)
      imgBlock.style = ''
    }
  }
}
const onZoomMouseMove = event => {
  event.preventDefault()
  imgZoom.translateX = -1 * (event.pageX - imgZoom.initialX)
  imgZoom.translateY = -1 * (event.pageY - imgZoom.initialY)
  event.target.style.transform = `translate(${imgZoom.translateX}px, ${imgZoom.translateY}px) scale(${imgZoom.scale})`
  console.log(`imgZoom.translateX: ${JSON.stringify(imgZoom.translateX, null, 2)}`)
  console.log(`imgZoom.translateY: ${JSON.stringify(imgZoom.translateY, null, 2)}`)
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
        @mouseup="onCarouselMouseUp"
        @mousedown="notClose = false"
        @mousemove="notClose = true"
        ref="mViewer"
        :items="files"
        :ui="{
          wrapper: 'c_wrapper w-screen h-screen flex flex-col',
          container: 'c_container relative items-center flex-1 p-2 bg-yellow-200',
          item: 'c_item basis-full justify-center max-h-full',
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
            @mouseup="onImageMouseUp"
            @mousedown="imgDrag = false"
            @mousemove="imgDrag = true"
            :src="`${imagesDirectory}full_${item}`"
            class="border border-blue-700 w-min min-w-10 object-contain shrink overflow-auto transition-transform duration-500 cursor-zoom-in"
            draggable="false"
          />
        </template>

        <template #indicator="{ onClick, page, active }">
          <img
            @click="onClick(page)"
            @mouseup="notClose = true"
            :src="`${imagesDirectory}thumb_${files[page - 1]}`"
            class="max-w-[100px] max-h-full min-w-5 shrink object-contain"
            :class="{
              'cursor-pointer border border-red-700': !active,
              'cursor-default border-4 border-green-700': active,
            }"
            draggable="false"
          />
        </template>

        <template #prev="{ onClick, disabled }">
          <button
            class="pointer-events-auto"
            :disabled="disabled"
            @mouseup="notClose = true"
            @click="onClick"
          >
            Prev
          </button>
        </template>

        <template #next="{ onClick, disabled }">
          <button
            class="pointer-events-auto"
            :disabled="disabled"
            @mouseup="notClose = true"
            @click="onClick"
          >
            Next
          </button>
        </template>
      </UCarousel>
    </UModal>
  </div>
</template>
