<script setup>
//
const props = defineProps({
  images: Array,
  activeImgIndex: Number,
})
const imagesDirectory = 'https://chelinstrument.ru/components/com_jshopping/files/img_products/'
// const imagesDirectory = 'https://test.chelinstrument.ru/images/test/'

const images = reactive(
  props.images.map(img => {
    return {
      name: img,
      load: false,
      error: false,
    }
  })
)
const helper = reactive({
  activeImg: props.activeImgIndex,
  queue: [],
})

const createQueue = queue => {
  // создаем очередь загрузки изображений, поочередно добавляя элементы справа и слева от начального
  const next = []
  const prev = []
  for (let i = 0; i < images.length; i++) {
    if (i > helper.activeImg) next.push(i)
    else if (i !== helper.activeImg) prev.push(i)
  }
  prev.reverse()
  const maxLength = Math.max(next.length, prev.length)
  queue.push(helper.activeImg)
  for (let i = 0; i < maxLength; i++) {
    if (i < next.length) {
      queue.push(next[i])
    }
    if (i < prev.length) {
      queue.push(prev[i])
    }
  }
}
createQueue(helper.queue)

watch(
  () => helper.activeImg,
  () => {
    // добавляем активное изображение в начало очереди загрузки
    if (images[helper.activeImg].load || helper.queue.length < 2) return

    const i = helper.queue.indexOf(helper.activeImg)
    if (i === -1) return
    helper.queue.splice(i, 1)
    helper.queue.unshift(helper.activeImg)
  }
)

const mViewer = ref(null)

const scrollToActiveImg = () => {
  // скролим до активного изображения
  const container = mViewer.value.$el.firstElementChild
  const containerWidth = container.clientWidth
  const containerScroll = container.scrollLeft
  const activeImg = container.children[props.activeImgIndex]
  const activeImgOffset = activeImg.offsetLeft
  const visible = containerWidth + containerScroll > activeImgOffset && containerScroll <= activeImgOffset
  if (!visible) {
    container.scroll({
      top: 0,
      left: activeImgOffset,
      behavior: 'instant',
    })
  }
}

const loadImg = () => {
  // запускает загрузку изображения из очереди

  if (helper.queue.length === 0) return
  const loadingImg = helper.queue.shift()
  const tempImg = new Image()
  const imgSrc = `${imagesDirectory}${images[loadingImg].name}`
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

onMounted(() => {
  if (images.length > 1 && helper.activeImg > 0) scrollToActiveImg()
  loadImg()
})
</script>

<template>
  <div class="w-full h-screen bg-slate-400 overflow-auto">
    <UCarousel
      ref="mViewer"
      :items="images"
      :ui="{
        item: 'basis-full justify-center p-2',
        indicators: {
          wrapper: 'relative bottom-0 mt-4 overflow-auto items-stretch bg-green-200',
        },
      }"
      :indicators="props.images.length > 1"
      :arrows="props.images.length > 1"
      :prev-button="{
        color: 'gray',
        icon: 'i-heroicons-arrow-left-20-solid',
        class: '',
      }"
      :next-button="{
        color: 'gray',
        icon: 'i-heroicons-arrow-right-20-solid',
        class: '',
      }"
      class="ucarousel p-2 h-full"
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
          :src="`${imagesDirectory}full_${item.name}`"
          class="border border-blue-700 w-min min-w-10 object-contain shrink"
          draggable="false"
        />
      </template>

      <template #indicator="{ onClick, page, active }">
        <ImageViewerActiveImgHelper
          :helper="helper"
          :active="active"
          :page="page"
        />
        <img
          :src="`${imagesDirectory}thumb_${images[page - 1].name}`"
          class="max-w-[100px] min-w-5 shrink object-contain"
          :class="{
            'cursor-pointer border border-red-700': !active,
            'cursor-default border-4 border-green-700': active,
          }"
          draggable="false"
          @click="onClick(page)"
        />
      </template>
    </UCarousel>
  </div>
</template>
