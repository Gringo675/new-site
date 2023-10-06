import catsG from '~/composables/admin/cats/catsG'

export const moveCatsDebounced = {
  timerValue: 500,
  coolDownValue: 500,
  timer: null,
  isCoolDown: false,
  go(targetIndex) {
    if (this.isCoolDown) return
    clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      let targetArray =
        catsG.draggableCatIndex.group === 'none' ? catsG.cats : catsG.cats[catsG.draggableCatIndex.group].children
      targetArray.splice(targetIndex, 0, targetArray.splice(catsG.draggableCatIndex.item, 1)[0])
      catsG.draggableCatIndex.item = targetIndex
      catsG.createNewCatsOrder(targetArray)

      this.isCoolDown = true
      setTimeout(() => (this.isCoolDown = false), this.coolDownValue)
    }, this.timerValue)
  },
}
export const handleDragStart = ev => {
  if (ev.target.dataset?.dragGroup === undefined) return
  catsG.draggableCatIndex.group = ev.target.dataset.dragGroup
  catsG.draggableCatIndex.item = ev.target.dataset.dragItem
  ev.dataTransfer.setDragImage(ev.target.parentElement, 15, 20)
}
export const handleDragEnd = () => {
  catsG.draggableCatIndex.group = null
  catsG.draggableCatIndex.item = null
}
export const handleDragEnter = ev => {
  if (catsG.draggableCatIndex.group === null) return
  ev.preventDefault()
  const currentIndex = {
    group: ev.target.dataset?.dragGroup,
    item: ev.target.dataset?.dragItem,
  }
  if (
    currentIndex.group === undefined ||
    currentIndex.group !== catsG.draggableCatIndex.group ||
    currentIndex.item == catsG.draggableCatIndex.item
  )
    return
  moveCatsDebounced.go(currentIndex.item)
}
export const handleDragOver = ev => {
  if (catsG.draggableCatIndex.group === null) return
  ev.preventDefault()
  const currentIndex = {
    group: ev.target.dataset?.dragGroup,
    item: ev.target.dataset?.dragItem,
  }
  if (
    currentIndex.group === undefined ||
    currentIndex.group !== catsG.draggableCatIndex.group ||
    currentIndex.item == catsG.draggableCatIndex.item
  ) {
    ev.dataTransfer.dropEffect = 'none'
  } else {
    ev.dataTransfer.dropEffect = 'move'
  }
}
