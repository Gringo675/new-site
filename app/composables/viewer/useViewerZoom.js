const imgZoom = {
  target: null,
  scale: 2,
}
const activateZoom = event => {
  imgZoom.target = event.target
  calculateZoom(event)
  imgZoom.target.style.cursor = 'zoom-out'
  imgZoom.target.dataset.zoomed = true
  window.addEventListener('pointerdown', deactivateZoom, { capture: true, once: true })
}

const calculateZoom = event => {
  const imgCoords = imgZoom.target.getBoundingClientRect()
  const centerX = imgCoords.left + imgCoords.width / 2
  const centerY = imgCoords.top + imgCoords.height / 2
  const maxTranslateX = Math.max((imgCoords.width * imgZoom.scale) / 2 - centerX, 0)
  const maxTranslateY = Math.max((imgCoords.height * imgZoom.scale) / 2 - centerY, 0)

  let translateX = (centerX - event.clientX) * (imgZoom.scale - 1)
  if (Math.abs(translateX) > maxTranslateX) {
    translateX = Math.sign(translateX) * maxTranslateX
  }
  let translateY = (centerY - event.clientY) * (imgZoom.scale - 1)
  if (Math.abs(translateY) > maxTranslateY) {
    translateY = Math.sign(translateY) * maxTranslateY
  }

  imgZoom.target.style.transform = `translate(${translateX}px, ${translateY}px) scale(${imgZoom.scale})`
}

const deactivateZoom = event => {
  imgZoom.target.style.removeProperty('transform')
  imgZoom.target.style.removeProperty('cursor')

  if (event.target.dataset.zoomed) {
    window.addEventListener(
      'click',
      e => {
        e.stopPropagation()
      },
      { capture: true, once: true },
    )
  }

  delete imgZoom.target.dataset.zoomed
}

export default activateZoom
