import { LazyDocViewer } from '#components'

const docViewer = useOverlay().create(LazyDocViewer)

export const showDocViewer = (options = {}) => {
  /**
   * options = {title, url}
   */
  if (import.meta.server) return

  docViewer.open(options)
}
