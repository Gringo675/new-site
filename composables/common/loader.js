const debounce = 400
let timer

const loader = reactive({
  isActive: false,
})

export const useLoader = () => {
  return loader
}

export const showLoader = () => {
  if (process.server) return
  clearTimeout(timer)
  timer = setTimeout(() => {
    loader.isActive = true
  }, debounce)
}

export const hideLoader = () => {
  clearTimeout(timer)
  loader.isActive = false
}
