export const useViewerPreventClosingAndAnimateScroll = (imageContainer, carousel) => {
  imageContainer.addEventListener('mousedown', event => {
    imageContainer.addEventListener('mousemove', preventClosingAndAnimateScroll, { once: true })
    window.addEventListener(
      'mouseup',
      () => imageContainer.removeEventListener('mousemove', preventClosingAndAnimateScroll),
      {
        once: true,
      }
    )
  })

  // smooth scroll for touch
  imageContainer.addEventListener('touchstart', event => {
    imageContainer.style.scrollSnapType = 'x mandatory'
  })

  const preventClosingAndAnimateScroll = () => {
    window.addEventListener('click', event => event.stopPropagation(), { capture: true, once: true })
    window.addEventListener(
      'mouseup',
      () => {
        carousel.value.select(carousel.value.page)
      },
      { once: true }
    )
  }
}
