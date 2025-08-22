export const useViewerEdgeImg = (imageContainer, carousel) => {
  const edgeImg = {
    target: null,
    multiplier: 0, // 1 - first, -1 - last
    startX: 0,
  }

  const checkEdgeBlock = event => {
    // проверяем, является ли текущее изображение крайне левым или правым
    const imgsQuantity = carousel.value.pages
    if (imgsQuantity < 2) return
    const currentImgIndex = carousel.value.page - 1
    if (currentImgIndex === 0 || currentImgIndex === imgsQuantity - 1) {
      edgeImg.target = imageContainer.children[currentImgIndex].firstElementChild
      if (edgeImg.target.tagName !== 'IMG') return
      if (edgeImg.target.dataset.zoomed) return
      edgeImg.startX = event.type === 'touchstart' ? event.touches[0].clientX : event.clientX
      edgeImg.width = edgeImg.target.offsetWidth
      edgeImg.multiplier = currentImgIndex === 0 ? 1 : -1
      window.addEventListener('mousemove', handleEdgeImg)
      window.addEventListener('mouseup', cleanEdgeImg, { capture: true, once: true })
      window.addEventListener('touchmove', handleEdgeImg)
      window.addEventListener('touchend', cleanEdgeImg, { capture: true, once: true })
      edgeImg.target.style.transitionDuration = '0s'
    }
  }
  const handleEdgeImg = event => {
    const clientX = event.type === 'touchmove' ? event.touches[0].clientX : event.clientX
    const delta = (clientX - edgeImg.startX) / 8 // уменьшаем эффект в несколько раз
    if (delta * edgeImg.multiplier > 0) {
      const translateX = delta
      const scaleX = (edgeImg.width + edgeImg.multiplier * delta) / edgeImg.width
      edgeImg.target.style.transform = `translateX(${translateX}px) scaleX(${scaleX})`
    }
  }
  const cleanEdgeImg = event => {
    window.removeEventListener('mousemove', handleEdgeImg)
    window.removeEventListener('mouseup', cleanEdgeImg, { capture: true })
    window.removeEventListener('touchmove', handleEdgeImg)
    window.removeEventListener('touchend', cleanEdgeImg, { capture: true })
    edgeImg.target.style.removeProperty('transform')
    edgeImg.target.style.removeProperty('transition-duration')
    edgeImg.target = null
  }

  imageContainer.addEventListener('mousedown', event => {
    checkEdgeBlock(event)
  })

  imageContainer.addEventListener('touchstart', event => {
    checkEdgeBlock(event)
  })
}
