import { onMounted, onUnmounted } from 'vue'
export const useCarouselScroll = (imageContainer, centerCurrentPage) => {
  const initialState = {
    x: 0,
    width: 0,
    scrollLeft: 0,
    maxScroll: 0,
  }
  function initiateScroll(e) {
    initialState.x = e.pageX || e.touches[0].pageX
    initialState.width = imageContainer.value.clientWidth
    initialState.scrollLeft = imageContainer.value.scrollLeft
    initialState.maxScroll = imageContainer.value.scrollWidth - imageContainer.value.clientWidth
    if (e.pointerType === 'touch') {
      imageContainer.value.addEventListener('touchmove', handleScroll)
      imageContainer.value.addEventListener('touchend', clearScrollEffects)
    } else {
      imageContainer.value.addEventListener('pointermove', handleFirstMove, { once: true })
      imageContainer.value.addEventListener('pointermove', handleScroll)
      imageContainer.value.addEventListener('pointerup', clearScrollEffects)
    }
  }

  function handleFirstMove(e) {
    imageContainer.value.setPointerCapture(e.pointerId) // это передаст все события от указателя на данный контейнер, вследствие чего на изображении не будет клика
    imageContainer.value.addEventListener(
      'click',
      e => {
        e.stopPropagation()
      },
      { once: true },
    ) // перехватывает следующий за перемещением клик, чтобы не закрывался полноэкранный viewer
    // p.s. тач-события устроены таким образом, что на изображении не будет клика, если было перемещение
  }

  function handleScroll(e) {
    // e.preventDefault() // touch error
    const actualScroll = initialState.scrollLeft - (e.pageX || e.touches[0].pageX) + initialState.x
    if (actualScroll < 0) {
      transformImageContainer(actualScroll)
    } else if (actualScroll > initialState.maxScroll) {
      transformImageContainer(actualScroll - initialState.maxScroll)
    } else imageContainer.value.scrollTo(actualScroll, 0)
  }

  function transformImageContainer(delta) {
    const translateX = (-1 * delta) / 3 // уменьшаем эффект в несколько раз
    const scaleX = (initialState.width + Math.abs(delta / 1.5)) / initialState.width
    const transform = `translateX(${translateX}px) scaleX(${scaleX})`
    imageContainer.value.style.transform = transform
  }

  function clearScrollEffects() {
    imageContainer.value.style.transform = ''
    centerCurrentPage()
    imageContainer.value.removeEventListener('touchmove', handleScroll)
    imageContainer.value.removeEventListener('touchend', clearScrollEffects)
    imageContainer.value.removeEventListener('pointermove', handleFirstMove)
    imageContainer.value.removeEventListener('pointermove', handleScroll)
    imageContainer.value.removeEventListener('pointerup', clearScrollEffects)
  }

  onMounted(() => {
    if (!imageContainer.value) return
    imageContainer.value.addEventListener('pointerdown', initiateScroll)
  })
  onUnmounted(() => {
    if (!imageContainer.value) return
    imageContainer.value.removeEventListener('pointerdown', initiateScroll)
  })
}
