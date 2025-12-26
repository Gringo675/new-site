export const useViewerImgLoad = (images, activeImgIndex, carousel) => {
  const state = {
    activeImg: activeImgIndex,
    queue: createQueue(),
    setActiveImg(value) {
      if (value === this.activeImg) return
      this.activeImg = value
      // добавляем активное изображение в начало очереди загрузки
      if (images[this.activeImg].load || this.queue.length < 2) return
      const i = this.queue.indexOf(this.activeImg)
      if (i === -1) return
      this.queue.splice(i, 1)
      this.queue.unshift(this.activeImg)
    },
    timer: null,
    setActiveImgDebounced(value) {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => this.setActiveImg(value), 400)
    },
  }

  function createQueue() {
    // создаем очередь загрузки изображений, поочередно добавляя элементы справа и слева от начального
    const queue = []
    const next = []
    const prev = []
    for (let i = 0; i < images.length; i++) {
      if (i > activeImgIndex) next.push(i)
      else if (i !== activeImgIndex) prev.push(i)
    }
    prev.reverse()
    const maxLength = Math.max(next.length, prev.length)
    queue.push(activeImgIndex)
    for (let i = 0; i < maxLength; i++) {
      if (i < next.length) {
        queue.push(next[i])
      }
      if (i < prev.length) {
        queue.push(prev[i])
      }
    }
    return queue
  }

  const loadImg = () => {
    // запускает загрузку изображения из очереди
    if (state.queue.length === 0) return
    const loadingImg = state.queue.shift()
    const tempImg = new Image()
    const imgSrc = images[loadingImg].full
    tempImg.addEventListener(
      'load',
      () => {
        loadImg()
      },
      true,
    )
    tempImg.addEventListener(
      'error',
      () => {
        console.error(`Can't load image ${imgSrc}`)
        images[loadingImg].error = true
        loadImg()
      },
      true,
    )
    tempImg.src = imgSrc
    images[loadingImg].load = true
  }

  let unwatch
  onMounted(() => {
    loadImg()
    // корректно работает только так
    setTimeout(() => {
      unwatch = watch(
        () => carousel.value?.page,
        page => state.setActiveImgDebounced(page - 1),
      )
    }, 0)
  })

  onBeforeUnmount(() => {
    unwatch()
  })
}
