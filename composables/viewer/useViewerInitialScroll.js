export const useViewerInitialScroll = (viewerData, imageContainer) => {
  if (viewerData.images.length === 1 || viewerData.activeImgIndex === 0) return
  const containerWidth = imageContainer.offsetWidth
  imageContainer.scrollTo({
    top: 0,
    left: containerWidth * viewerData.activeImgIndex,
    behavior: 'instant',
  })
}
