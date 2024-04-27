const viewer = reactive({
  isActive: false,
  transitionX: 0,
  transitionY: 0,
  scale: 1,
})

const viewerData = {
  images: [],
  activeImgIndex: 0,
}

export const useImageViewer = () => {
  return viewer
}

export const showImageViewer = (images, activeImgIndex = 0, transitionX = 0, transitionY = 0, scale = 1) => {
  viewerData.images = images
  viewerData.activeImgIndex = activeImgIndex
  viewer.isActive = true
  viewer.transitionX = transitionX
  viewer.transitionY = transitionY
  viewer.scale = scale
}

export const getImageViewerData = () => {
  return viewerData
}
