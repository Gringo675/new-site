/**
 * copied from node_modules\@nuxt\ui\dist\runtime\composables\useCarouselScroll.js


import { ref, onMounted, onUnmounted } from 'vue'
export const useCarouselScroll = el => {
  const x = ref(0)
  function onMouseDown(e) {
    x.value = e.pageX
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }
  function onMouseUp() {
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('mouseup', onMouseUp)
  }
  function onMouseMove(e) {
    e.preventDefault()
    const delta = e.pageX - x.value
    x.value = e.pageX
    el.value.scrollBy(-delta, 0)
  }
  onMounted(() => {
    if (!el.value) {
      return
    }
    el.value.addEventListener('mousedown', onMouseDown)
  })
  onUnmounted(() => {
    if (!el.value) {
      return
    }
    el.value.removeEventListener('mousedown', onMouseDown)
  })
}
 */
