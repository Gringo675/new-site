export const useViewerKeyPress = carousel => {
  const viewer = useImageViewer()

  onMounted(() => {
    document.addEventListener('keydown', handleKeyPress)
  })
  onBeforeUnmount(() => {
    document.removeEventListener('keydown', handleKeyPress)
  })
  const handleKeyPress = event => {
    if (event.key === 'Escape') viewer.isActive = false
    if (event.key === 'ArrowLeft') carousel.value.select(carousel.value.page - 1)
    if (event.key === 'ArrowRight') carousel.value.select(carousel.value.page + 1)
  }
}
