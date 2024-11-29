<script setup>
let isSubModal = false // если модульное окно вызывается из другого модульного окна, ничего делать не надо
let top = 0

onMounted(() => {
  const wrapper = document.querySelector('html')
  isSubModal = wrapper.hasAttribute('style')
  if (isSubModal) return
  const coord = wrapper.getBoundingClientRect()
  wrapper.style.cssText = `
                position: fixed;
                left: ${coord.left}px;
                top: ${coord.top}px;
                width: ${coord.width}px`
  top = coord.top * -1
})
onUnmounted(() => {
  if (isSubModal) return
  setTimeout(() => {
    // время на анимацию исчезновения
    const wrapper = document.querySelector('html')
    wrapper.removeAttribute('style')
    window.scrollTo(0, top)
  }, 300)
})
</script>

<template>
  <div class="fixed left-0 right-0 top-0 bottom-0 z-30 bg-gray-300/60 flex flex-col items-center justify-center">
    <slot></slot>
  </div>
</template>

<style></style>
