<script setup>

const items = reactive([111, 222, 333, 444, 555])

const draggableElementIndex = ref(null) // который перетаскиваем

const handleDragStart = (ev) => {
  if (ev.target.dataset?.draggable === undefined) return
  draggableElementIndex.value = Number(ev.target.parentElement.dataset.index)
  ev.dataTransfer.setDragImage(ev.target.parentElement, 18, 20)
}
const handleDragEnd = () => {
  draggableElementIndex.value = null
}
const handleDragEnter = (ev) => {
  ev.preventDefault()
  if (draggableElementIndex.value === null) return
  let currentIndex = Number(ev.target.dataset?.index)
  console.log(`currentIndex: ${currentIndex}`)
  if (isNaN(currentIndex) || currentIndex === draggableElementIndex.value) return

  changeArrayDebounced.go(currentIndex)
}
const handleDragOver = (ev) => {
  if (draggableElementIndex.value === null) return
  ev.preventDefault()
  ev.dataTransfer.dropEffect = "move"
}
const changeArrayDebounced = {
  timerValue: 500,
  coolDownValue: 500,
  timer: null,
  isCoolDown: false,
  go(targetIndex) {
    if (this.isCoolDown) return
    clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      items.splice(targetIndex, 0, items.splice(draggableElementIndex.value, 1)[0])
      draggableElementIndex.value = targetIndex
      this.isCoolDown = true
      setTimeout(() => this.isCoolDown = false, this.coolDownValue)
    }, this.timerValue)
  }
}
</script>

<template>
  <div class="wrapper w-64 bg-amber-100 flex flex-col items-center p-4"
       @dragstart="handleDragStart" @dragend="handleDragEnd" @dragenter="handleDragEnter" @dragover="handleDragOver"
  >
    <TransitionGroup name="list">
      <div v-for="(item, index) in items"
           class="m-2 px-3 py-2 bg-cyan-300 rounded-xl"
           :class="{'opacity-20': draggableElementIndex === index}"
           :key="item"
           :data-index="index"
      >
        <img class="inline cursor-move select-none m-1"
             src="@/img/arrows-move.svg"
             data-draggable
        >
        <span class="bg-gray-100 p-1 rounded">{{ item }}</span>
      </div>
    </TransitionGroup>
  </div>
</template>

<style lang="scss">
.list-move {
  transition: all .5s ease;
}
</style>