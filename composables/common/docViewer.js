import { LazyDocViewer } from '#components'

const imageViewer = useOverlay().create(LazyDocViewer)

export const showDocViewer = (options = {}) => {
  /**
   * options = {title, url}
   */
  if (import.meta.server) return

  imageViewer.open(options)
}

// export const closeImageViewer = () => imageViewer.close()
