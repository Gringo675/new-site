<script setup>
/**
 * todo:
 * z-index on zoomed image (upper arrows)
 * transition from causer
 * arrows style
 * test mobile
 * animate first, last
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

// обрабатываем клики и перемещение
const carousel = ref(null)
let imageContainer = null
const onCarouselMounted = () => {
  console.log(`from onCarouselMounted`)
  imageContainer = carousel.value.$el.firstElementChild
  // imageContainer.style = 'border: 3px solid red'
  imageContainer.addEventListener('mousedown', event => {
    if (event.target.tagName === 'IMG') onImageMouseDown(event)
    imageContainer.addEventListener('mousemove', onContainerMouseMove, { once: true })
    window.addEventListener('mouseup', () => {
      imageContainer.removeEventListener('mousemove', onContainerMouseMove), { once: true }
    })
  })
}
const onContainerMouseMove = () => {
  console.log(`from onContainerMouseMove`)
  window.addEventListener('click', event => event.stopPropagation(), { capture: true, once: true }) // prevent closing
}
const onCarouselClick = () => {
  // isOpen.value = false
  console.log(`carousel closed`)
}
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

const onImageMouseDown = event => {
  console.log(`from onImageMouseDown`)
  event.target.addEventListener('mouseup', onImageMouseUp, { once: true })
  event.target.addEventListener('mousemove', cancelOnImageMouseUp, { once: true })
}
const cancelOnImageMouseUp = event => {
  console.log(`from cancelOnImageMouseUp`)
  event.target.removeEventListener('mouseup', onImageMouseUp)
}
const onImageMouseUp = event => {
  console.log(`from onImageMouseUp`)
  event.target.removeEventListener('mousemove', cancelOnImageMouseUp)
  activateZoom(event)
}
const activateZoom = event => {
  console.log(`from activateZoom`)
  imgZoom.target = event.target

  const imgCoords = imgZoom.target.getBoundingClientRect()
  imgZoom.centerX = imgCoords.left + imgCoords.width / 2
  imgZoom.centerY = imgCoords.top + imgCoords.height / 2
  imgZoom.maxTranslateX = Math.max((imgCoords.width * (imgZoom.scale - 1)) / 2 - imgCoords.left, 0)
  imgZoom.maxTranslateY = Math.max((imgCoords.height * (imgZoom.scale - 1)) / 2 - imgCoords.top, 0)
  imgZoom.offsetX = 0
  imgZoom.offsetY = 0

  imgZoom.target.addEventListener('mousemove', calculateZoom)
  imgZoom.target.addEventListener('touchstart', onTouchStart)
  imgZoom.target.addEventListener('touchmove', onTouchMove)

  window.addEventListener('mousedown', deactivateZoom, { capture: true, once: true })
  imgZoom.target.addEventListener('transitionend', () => (imgZoom.target.style.transition = 'none'), { once: true })
  imgZoom.target.style.cursor = 'zoom-out'
  calculateZoom(event)
}
const onTouchStart = event => {
  console.log(`from onTouchStart`)
  imgZoom.target.removeEventListener('mousemove', calculateZoom)

  imgZoom.centerX = event.touches[0].clientX
  imgZoom.centerY = event.touches[0].clientY
  const transform = imgZoom.target.style.transform
  const match = transform.match(/translate\((-?\d*\.?\d+)px, (-?\d*\.?\d+)px\)/) ?? []
  imgZoom.offsetX = Number(match[1]) ?? 0
  imgZoom.offsetY = Number(match[2]) ?? 0
  console.log(`imgZoom.offsetX: ${JSON.stringify(imgZoom.offsetX, null, 2)}`)
  console.log(`imgZoom.offsetY: ${JSON.stringify(imgZoom.offsetY, null, 2)}`)
}
const onTouchMove = event => {
  console.log(`from onTouchMove`)
  event.preventDefault()

  const translateX = Math.min(
    Math.max(event.touches[0].clientX - imgZoom.centerX + imgZoom.offsetX, -imgZoom.maxTranslateX),
    imgZoom.maxTranslateX
  )
  const translateY = Math.min(
    Math.max(event.touches[0].clientY - imgZoom.centerY + imgZoom.offsetY, -imgZoom.maxTranslateY),
    imgZoom.maxTranslateY
  )
  console.log(`translateX: ${JSON.stringify(translateX, null, 2)}`)
  console.log(`translateY: ${JSON.stringify(translateY, null, 2)}`)
  // const translateY = Math.min(
  //   Math.max(imgZoom.scale * (imgZoom.centerY - event.clientY), -imgZoom.maxTranslateY),
  //   imgZoom.maxTranslateY
  // )
  imgZoom.target.style.transform = `translate(${translateX}px, ${translateY}px) scale(${imgZoom.scale})`
}
const calculateZoom = event => {
  console.log(`from calculateZoom`)
  event.preventDefault()
  // const translateX = Math.min(
  //   Math.max(imgZoom.scale * (imgZoom.centerX - event.clientX), -imgZoom.maxTranslateX),
  //   imgZoom.maxTranslateX
  // )
  // const translateY = Math.min(
  //   Math.max(imgZoom.scale * (imgZoom.centerY - event.clientY), -imgZoom.maxTranslateY),
  //   imgZoom.maxTranslateY
  // )

  // let translateX = imgZoom.centerX - event.clientX
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
}

const deactivateZoom = event => {
  console.log(`from deactivateZoom`)
  event.stopPropagation()
  imgZoom.target.removeEventListener('mousemove', calculateZoom)
  imgZoom.target.removeEventListener('touchstart', onTouchStart)
  imgZoom.target.removeEventListener('touchmove', onTouchMove)
  imgZoom.target.style = ''
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
          container: 'c_container relative items-center flex-1 bg-yellow-200',
          item: 'c_item basis-full justify-center h-full items-center p-2',
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
            class="pointer-events-auto"
            :disabled="disabled"
            @click.stop="onClick"
          >
            Prev
          </button>
        </template>

        <template #next="{ onClick, disabled }">
          <button
            class="pointer-events-auto"
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
