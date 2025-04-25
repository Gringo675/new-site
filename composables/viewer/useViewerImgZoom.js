export const useViewerImgZoom = imageContainer => {
  const imgZoom = {
    target: null,
    centerX: 0,
    centerY: 0,
    maxTranslateX: 0,
    maxTranslateY: 0,
    offsetX: 0,
    offsetY: 0,
    scale: 2,
  }

  imageContainer.addEventListener('mousedown', event => {
    if (event.target.tagName !== 'IMG') return
    event.target.addEventListener('mouseup', activateZoom, { once: true })
    event.target.addEventListener('mousemove', cancelOnImageMouseUp, { once: true })
  })

  const cancelOnImageMouseUp = event => {
    event.target.removeEventListener('mouseup', activateZoom)
  }

  // imageContainer.addEventListener('pointerdown', event => {
  //   if (event.target.tagName !== 'IMG') return
  //   event.target.addEventListener('pointerup', () => console.log(`pointerup`), { once: true })
  //   event.target.addEventListener('pointermove', () => console.log(`pointermove`), { once: true })
  // })

  const activateZoom = event => {
    console.log(`activateZoom`)
    event.target.removeEventListener('mousemove', cancelOnImageMouseUp)
    imgZoom.target = event.target

    const imgCoords = imgZoom.target.getBoundingClientRect()
    imgZoom.centerX = imgCoords.left + imgCoords.width / 2
    imgZoom.centerY = imgCoords.top + imgCoords.height / 2
    imgZoom.maxTranslateX = Math.max((imgCoords.width * (imgZoom.scale - 1)) / 2 - imgCoords.left, 0)
    imgZoom.maxTranslateY = Math.max((imgCoords.height * (imgZoom.scale - 1)) / 2 - imgCoords.top, 0)
    imgZoom.offsetX = 0
    imgZoom.offsetY = 0

    imgZoom.target.addEventListener('mousemove', calculateZoom)
    imgZoom.target.addEventListener('touchstart', onTouchStart)
    // imgZoom.target.addEventListener('touchmove', onTouchMove)
    imageContainer.addEventListener('touchmove', onContainerTouchMove)
    window.addEventListener('mousedown', deactivateZoom, { capture: true, once: true })
    imgZoom.target.addEventListener('transitionend', cancelTransition, {
      once: true,
    })
    window.addEventListener('resize', deactivateZoom, { once: true })

    imgZoom.target.style.cursor = 'zoom-out'
    imgZoom.target.style.zIndex = '10'
    // imgZoom.target.dataset.zoomed = true
    calculateZoom(event)
  }

  const cancelTransition = () => {
    console.log(`cancelTransition`)
    imgZoom.target.style.transition = 'none'
  }

  const onTouchStart = event => {
    console.log(`onTouchStart`)
    console.log(`before imgZoom.offsetX: ${JSON.stringify(imgZoom.offsetX, null, 2)}`)
    console.log(`before imgZoom.offsetY: ${JSON.stringify(imgZoom.offsetY, null, 2)}`)
    imgZoom.target.removeEventListener('mousemove', calculateZoom)

    imgZoom.centerX = event.touches[0].clientX
    imgZoom.centerY = event.touches[0].clientY
    const transform = imgZoom.target.style.transform
    const match = transform.match(/translate\((-?\d*\.?\d+)px, (-?\d*\.?\d+)px\)/) ?? []
    imgZoom.offsetX = Number(match[1]) ?? 0
    imgZoom.offsetY = Number(match[2]) ?? 0
    console.log(`imgZoom.offsetX: ${JSON.stringify(imgZoom.offsetX, null, 2)}`)
    console.log(`imgZoom.offsetY: ${JSON.stringify(imgZoom.offsetY, null, 2)}`)
  }

  const calculateZoom = event => {
    console.log(`calculateZoom`)
    event.preventDefault()
    let translateX = imgZoom.centerX - event.clientX - imgZoom.offsetX
    if (translateX < -imgZoom.maxTranslateX) {
      imgZoom.offsetX = imgZoom.centerX + imgZoom.maxTranslateX - event.clientX
      translateX = -imgZoom.maxTranslateX
    } else if (translateX > imgZoom.maxTranslateX) {
      imgZoom.offsetX = imgZoom.centerX - imgZoom.maxTranslateX - event.clientX
      translateX = imgZoom.maxTranslateX
    }

    let translateY = imgZoom.centerY - event.clientY - imgZoom.offsetY
    if (translateY < -imgZoom.maxTranslateY) {
      imgZoom.offsetY = imgZoom.centerY + imgZoom.maxTranslateY - event.clientY
      translateY = -imgZoom.maxTranslateY
    } else if (translateY > imgZoom.maxTranslateY) {
      imgZoom.offsetY = imgZoom.centerY - imgZoom.maxTranslateY - event.clientY
      translateY = imgZoom.maxTranslateY
    }

    imgZoom.target.style.transform = `translate(${translateX}px, ${translateY}px) scale(${imgZoom.scale})`
    console.log(`translateX: ${JSON.stringify(translateX, null, 2)}`)
    console.log(`translateY: ${JSON.stringify(translateY, null, 2)}`)
  }

  const onContainerTouchMove = event => {
    console.log(`onContainerTouchMove`)
    // event.preventDefault()
    if (event.target === imgZoom.target) calculateTouch(event)
    else deactivateZoom(event)
  }

  const calculateTouch = event => {
    console.log(`calculateTouch`)
    // event.preventDefault()

    const translateX = Math.min(
      Math.max(event.touches[0].clientX - imgZoom.centerX + imgZoom.offsetX, -imgZoom.maxTranslateX),
      imgZoom.maxTranslateX,
    )
    const translateY = Math.min(
      Math.max(event.touches[0].clientY - imgZoom.centerY + imgZoom.offsetY, -imgZoom.maxTranslateY),
      imgZoom.maxTranslateY,
    )
    imgZoom.target.style.transform = `translate(${translateX}px, ${translateY}px) scale(${imgZoom.scale})`
  }

  const deactivateZoom = event => {
    console.log(`deactivateZoom`)
    event.stopPropagation()
    imgZoom.target.removeEventListener('mousemove', calculateZoom)
    window.removeEventListener('mousedown', deactivateZoom, { capture: true })
    imgZoom.target.removeEventListener('touchstart', onTouchStart)
    // imgZoom.target.removeEventListener('touchmove', onTouchMove)
    imageContainer.removeEventListener('touchmove', onContainerTouchMove)
    imgZoom.target.removeEventListener('transitionend', cancelTransition) // double-click protection
    imgZoom.target.style.removeProperty('transform')
    imgZoom.target.style.removeProperty('transition')
    imgZoom.target.style.removeProperty('cursor')
    imgZoom.target.style.removeProperty('z-index')
    // delete imgZoom.target.dataset.zoomed
  }
}
