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
  'SHC1STIZ.jpg',
  'shc-i-stiz_1.jpg',
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
}
const onImageMouseUp = () => {
  notClose = true
  if (!imgDrag) console.log(`image click`)
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
          container: 'c_container items-center flex-1 p-2 bg-yellow-200',
          item: 'c_item basis-full justify-center',
          indicators: {
            wrapper: 'i_wrapper relative max-h-[20vh] bottom-0 p-2 nrw:hidden bg-green-200',
          },
          arrows: {
            wrapper: 'absolute w-full  bg-blue-400',
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
            :src="`${imagesDirectory}${item}`"
            class="border border-blue-700 w-min min-w-10 object-contain shrink overflow-auto"
            draggable="false"
          />
        </template>

        <template #indicator="{ onClick, page, active }">
          <img
            @click="onClick(page)"
            @mouseup="notClose = true"
            :src="`${imagesDirectory}thumb_${files[page - 1]}`"
            class="max-w-[100px] min-w-5 shrink object-contain"
            :class="{
              'cursor-pointer border border-red-700': !active,
              'cursor-default border-4 border-green-700': active,
            }"
            draggable="false"
          />
        </template>

        <template #prev="{ onClick, disabled }">
          <button
            :disabled="disabled"
            @click="onClick"
          >
            Prev
          </button>
        </template>

        <template #next="{ onClick, disabled }">
          <button
            :disabled="disabled"
            @click="onClick"
          >
            Next
          </button>
        </template>
      </UCarousel>
    </UModal>
  </div>
</template>
