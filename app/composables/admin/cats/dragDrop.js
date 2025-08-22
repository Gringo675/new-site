import catsG from '~/composables/admin/cats/catsG'

export const moveCatsDebounced = {
  timerValue: 500,
  coolDownValue: 500,
  timer: null,
  isCoolDown: false,
  go(dataCatIndexes) {
    if (this.isCoolDown) return
    clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      if (catsG.draggingCatIndexes.length === 0) return
      const targetCatIndexes = JSON.parse(dataCatIndexes)
      const targetArray =
        targetCatIndexes.length === 1 ? catsG.cats : catsG.getCat(targetCatIndexes.slice(0, -1)).children

      targetArray.splice(
        targetCatIndexes[targetCatIndexes.length - 1],
        0,
        targetArray.splice(catsG.draggingCatIndexes[catsG.draggingCatIndexes.length - 1], 1)[0]
      )
      catsG.draggingCatIndexes = targetCatIndexes
      catsG.createNewCatsOrder(targetArray)

      this.isCoolDown = true
      setTimeout(() => (this.isCoolDown = false), this.coolDownValue)
    }, this.timerValue)
  },
}
export const handleDragStart = ev => {
  if (ev.target.dataset?.catIndexes === undefined) return
  catsG.draggingCatIndexes = JSON.parse(ev.target.dataset.catIndexes)
  ev.dataTransfer.setDragImage(ev.target.parentElement, 15, 20)
}
export const handleDragEnd = () => {
  catsG.draggingCatIndexes = []
}
export const handleDragEnter = ev => {
  if (catsG.draggingCatIndexes.length === 0) return
  ev.preventDefault()
  if (ev.target.dataset?.dragGroup === '1') moveCatsDebounced.go(ev.target.dataset.catIndexes)
}
export const handleDragOver = ev => {
  if (catsG.draggingCatIndexes.length === 0) return
  ev.preventDefault()
  if (ev.target.dataset?.dragGroup === '1') ev.dataTransfer.dropEffect = 'move'
  else ev.dataTransfer.dropEffect = 'none'
}
