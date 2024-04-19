<script setup>
//
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

const tContainer = ref(null)
const x = ref(0)
function onMouseDown(e) {
  tContainer.value.style.scrollSnapType = 'none'
  x.value = e.pageX
  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseup', onMouseUp)
}
function onMouseUp() {
  tContainer.value.scroll({ top: 0, left: 1248, behavior: 'smooth' })
  tContainer.value.addEventListener(
    'scrollend',
    () => {
      console.log('scrollended')
      tContainer.value.style.removeProperty('scroll-snap-type')
    },
    { once: true }
  )
  // tContainer.value.style.removeProperty('scroll-snap-type')
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('mouseup', onMouseUp)
}
function onMouseMove(e) {
  e.preventDefault()
  const delta = e.pageX - x.value
  x.value = e.pageX
  tContainer.value.scrollBy(-delta, 0)
}
onMounted(() => {
  tContainer.value.addEventListener('mousedown', onMouseDown)
})

const onTest = () => {
  tContainer.value.style.scrollSnapType = 'x mandatory'
  setTimeout(() => {
    tContainer.value.style.removeProperty('scroll-snap-type')
  }, 2000)
}
</script>

<template>
  <div
    ref="tContainer"
    class="t_container snap-x snap-mandatory border border-stone-400 flex m-2 w-[1250px] bg-stone-200 overflow-auto"
  >
    <div
      v-for="file in files"
      class="snap-center snap-always w-full shrink-0 border border-blue-200 flex justify-center items-center"
    >
      <img
        :src="imagesDirectory + file"
        class="border border-orange-300"
        draggable="false"
      />
    </div>
  </div>
  <UButton @click="onTest">test</UButton>
</template>
