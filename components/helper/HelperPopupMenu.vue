<script setup>
//
// const open = defineModel('open')
// const wrapper = useTemplateRef('wrapperRef')
// const handleShowSiblingsClick = () => {
//   if (menuState.show) return
//   menuState.maxHeight = `${window.innerHeight - menuState.ref.getBoundingClientRect().bottom - 30}px`
//   menuState.maxWidth = `${window.innerWidth - menuState.ref.getBoundingClientRect().left - 25}px`
//   menuState.show = true
//   setTimeout(() => window.addEventListener('click', () => (menuState.show = false), { once: true }), 10)
// }
// onMounted(() => {
//   setTimeout(() => window.addEventListener('click', () => (open.value = false), { once: true }), 10)
// })
// watch(open, val => {
//   if (val) {
//     setTimeout(() => window.addEventListener('click', () => (open.value = false), { once: true }), 10)
//   }
// })
const open = ref(false)
const show = () => {
  if (open.value) return
  open.value = true
  setTimeout(() => window.addEventListener('click', close, { once: true }), 10)
}
const close = () => {
  open.value = false
}

const handleContentClick = event => {
  if (event.target.closest('a') || event.target.closest('button')) {
    open.value = false
    window.removeEventListener('click', close)
  } else event.stopPropagation()
}

const contentRef = useTemplateRef('contentRef')
const handleContentSize = () => {
  const rect = contentRef.value.getBoundingClientRect()
  if (rect.left < 0) contentRef.value.style.maxWidth = `${rect.width + rect.left - 20}px`
  else if (rect.right > window.innerWidth)
    contentRef.value.style.maxWidth = `${rect.width - (rect.right - window.innerWidth) - 20}px`
  if (rect.bottom > window.innerHeight) {
    // transition-below adds 20px
    contentRef.value.style.maxHeight = `${rect.height - (rect.bottom - window.innerHeight)}px`
  }
  // // Выход за правую границу
  // const overflowRight = rect.right - window.innerWidth
  // // Выход за нижнюю границу
  // const overflowBottom = rect.bottom - window.innerHeight
  // // Выход за левую границу
  // const overflowLeft = Math.abs(Math.min(0, rect.left))
  // // Выход за верхнюю границу
  // const overflowTop = Math.abs(Math.min(0, rect.top))

  // console.log({
  //   overflowRight: Math.max(0, overflowRight),
  //   overflowBottom: Math.max(0, overflowBottom),
  //   overflowLeft,
  //   overflowTop,
  // })
  // if (overflowBottom > 0) {
  //   // transition-below adds 20px
  //   contentRef.value.style.maxHeight = `${rect.height - overflowBottom + 10}px`
  // }
}
</script>

<template>
  <div class="relative w-fit">
    <slot
      name="trigger"
      :show="show"
    />
    <Transition
      name="transition-below"
      @enter="handleContentSize"
    >
      <div
        v-if="open"
        ref="contentRef"
        class="absolute z-20 mt-2 overflow-hidden rounded-lg border border-gray-300 bg-gray-200"
        @click="handleContentClick"
      >
        <div class="menu-scrollbar m-2 h-full w-full overflow-auto">
          <slot name="content" />
        </div>
      </div>
    </Transition>
  </div>
</template>
