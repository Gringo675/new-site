import { LazyTheLoader } from '#components'

const loader = useOverlay().create(LazyTheLoader)

const debounce = 400
let timer

export const showLoader = () => {
  if (import.meta.server) return

  clearTimeout(timer)
  timer = setTimeout(() => {
    loader.open()
  }, debounce)
}

export const hideLoader = () => {
  clearTimeout(timer)
  loader.close()
}
