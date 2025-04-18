import { LazyImageViewerFull } from '#components'

const imageViewer = useOverlay().create(LazyImageViewerFull)

export const showImageViewer = (images, options = {}) => {
  if (import.meta.server) return
  if (images.length === 0) return

  options.images = images
  options.activeImgIndex = options.activeImgIndex ?? 0
  options.causerId = options.causerId ?? null

  imageViewer.open(options)
}

export const closeImageViewer = () => imageViewer.close()
