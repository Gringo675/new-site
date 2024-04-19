export const useViewerEdgeImg = (imageContainer, carouselBlock, filesLength) => {
  const edgeImg = {
    target: null,
    multiplier: 0, // 1 - first, -1 - last
    startX: 0,
  }
  const checkEdgeBlock = event => {
    // проверяем, является ли текущее изображение крайне левым или правым
    console.log(`from checkEdgeBlock`)
    if (filesLength < 2) return
    const currentImgIndex = carouselBlock.value.page - 1
    if (currentImgIndex === 0 || currentImgIndex === filesLength - 1) {
      edgeImg.target = imageContainer.children[currentImgIndex].children[0]
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
    console.log(`from handleEdgeImg`)
    const clientX = event.type === 'touchmove' ? event.touches[0].clientX : event.clientX
    const delta = (clientX - edgeImg.startX) / 8 // уменьшаем эффект в несколько раз
    console.log(`edgeImg.startX: ${JSON.stringify(edgeImg.startX, null, 2)}`)
    console.log(`clientX: ${JSON.stringify(clientX, null, 2)}`)
    console.log(`delta: ${JSON.stringify(delta, null, 2)}`)
    if (delta * edgeImg.multiplier > 0) {
      const translateX = delta
      const scaleX = (edgeImg.width + edgeImg.multiplier * delta) / edgeImg.width
      edgeImg.target.style.transform = `translateX(${translateX}px) scaleX(${scaleX})`
    }
  }
  const cleanEdgeImg = () => {
    console.log(`from cleanEdgeImg`)
    window.removeEventListener('mousemove', handleEdgeImg)
    window.removeEventListener('mouseup', cleanEdgeImg)
    window.removeEventListener('touchmove', handleEdgeImg)
    window.removeEventListener('touchend', cleanEdgeImg)
    edgeImg.target.style = ''
    edgeImg.target = null
  }

  imageContainer.addEventListener('mousedown', event => {
    checkEdgeBlock(event)
  })

  imageContainer.addEventListener('touchstart', event => {
    imageContainer.style.scrollSnapType = 'x mandatory'
    checkEdgeBlock(event)
  })
}
