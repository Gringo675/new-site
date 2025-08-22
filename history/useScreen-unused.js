import { useWindowSize } from '@vueuse/core'
import { reactive, onMounted, watch } from 'vue'

const screen = reactive({
  isMobile: false,
  width: 1280,
  height: 720,
})

const breakpoint = 768
let initialized = false

const updateScreen = () => {
  const { width, height } = useWindowSize()
  screen.width = width.value
  screen.height = height.value
  screen.isMobile = width.value < breakpoint
}

export default () => {
  if (!initialized) {
    onMounted(() => {
      console.log(`from useScreen: mounted`)
      const { width } = useWindowSize()
      watch(
        width,
        () => {
          console.log(`from useScreen: watch`)
          updateScreen()
        },
        { immediate: true },
      )
    })
    initialized = true
  }

  return screen
}
