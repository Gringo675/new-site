<script setup>
const viewer = useImageViewer()
const viewerData = getImageViewerData()

const carousel = ref(null)
let imageContainer = null
const imagesDirectory = 'https://chelinstrument.ru/components/com_jshopping/files/img_products/'
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

const state = {
  activeImg: viewerData.activeImgIndex,
  queue: createQueue(),
  setActiveImg(value) {
    if (value === this.activeImg) return
    this.activeImg = value
    // добавляем активное изображение в начало очереди загрузки
    if (images[this.activeImg].load || this.queue.length < 2) return
    const i = this.queue.indexOf(this.activeImg)
    if (i === -1) return
    this.queue.splice(i, 1)
    this.queue.unshift(this.activeImg)
  },
  timer: null,
  setActiveImgDebounced(value) {
    clearTimeout(this.timer)
    this.timer = setTimeout(() => this.setActiveImg(value), 400)
  },
}

function createQueue() {
  // создаем очередь загрузки изображений, поочередно добавляя элементы справа и слева от начального
  const queue = []
  const next = []
  const prev = []
  for (let i = 0; i < images.length; i++) {
    if (i > viewerData.activeImgIndex) next.push(i)
    else if (i !== viewerData.activeImgIndex) prev.push(i)
  }
  prev.reverse()
  const maxLength = Math.max(next.length, prev.length)
  queue.push(viewerData.activeImgIndex)
  for (let i = 0; i < maxLength; i++) {
    if (i < next.length) {
      queue.push(next[i])
    }
    if (i < prev.length) {
      queue.push(prev[i])
    }
  }
  return queue
}

const loadImg = () => {
  // запускает загрузку изображения из очереди
  if (state.queue.length === 0) return
  const loadingImg = state.queue.shift()
  const tempImg = new Image()
  const imgSrc = `${imagesDirectory}full_${images[loadingImg].name}`
  tempImg.addEventListener(
    'load',
    () => {
      loadImg()
    },
    true
  )
  tempImg.addEventListener(
    'error',
    () => {
      console.error(`Can't load image ${imgSrc}`)
      images[loadingImg].error = true
      loadImg()
    },
    true
  )
  tempImg.src = imgSrc
  images[loadingImg].load = true
}
useViewerKeyPress(carousel)

let unwatch
onMounted(() => {
  imageContainer = carousel.value.$el.firstElementChild
  useViewerEdgeImg(imageContainer, carousel)
  useViewerImgZoom(imageContainer)
  useViewerPreventClosingAndAnimateScroll(imageContainer, carousel)
  scrollToActiveImg(imageContainer)
  loadImg()

  // корректно работает только так
  setTimeout(() => {
    unwatch = watch(
      () => carousel.value?.page,
      page => state.setActiveImgDebounced(page - 1)
    )
  }, 0)
})

onBeforeUnmount(() => {
  unwatch()
})

const scrollToActiveImg = imageContainer => {
  // скроллим до активного изображения
  if (images.length === 1 || state.activeImg === 0) return
  const containerWidth = imageContainer.offsetWidth
  imageContainer.scrollTo({
    top: 0,
    left: containerWidth * viewerData.activeImgIndex,
    behavior: 'instant',
  })
}
</script>

<template>
  <div class="ttest absolute top-0 left-0 z-50 m-2 text-5xl text-cyan-400">queue: {{ state.queue }}</div>
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
        wrapper: 'absolute top-1/2 -translate-y-1/2 w-full pointer-events-none ',
      },
    }"
    indicators
    arrows
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
</template>
