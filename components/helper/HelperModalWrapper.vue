<script setup>
onMounted(() => {
  let wrapper = document.querySelector("html")
  let coord = wrapper.getBoundingClientRect()
  wrapper.style.cssText = `
                position: fixed;
                left: ${coord.left}px;
                top: ${coord.top}px;`
})
onUnmounted(() => {
  setTimeout(()=> { // время на анимацию исчезновения
    let wrapper = document.querySelector("html")
    let top = wrapper.getBoundingClientRect().top * (-1)
    wrapper.removeAttribute('style');
    window.scrollTo(0, top);
  }, 300)
})
</script>

<template>
  <div class="
       fixed left-0 right-0 top-0 bottom-0 z-10 bg-gray-300/60
       flex flex-col items-center justify-center
       ">
    <slot></slot>
  </div>
</template>

<style lang="scss">

</style>