<script setup>

const items = reactive([111, 222, 333, 444, 555])

const draggableElementIndex = ref(null)

const handleDragStart = (ev) => {
  draggableElementIndex.value = Number(ev.target.dataset?.index ?? null)
}
const handleDragEnd = () => {
  draggableElementIndex.value = null
}
const handleDragEnter = (ev) => {
  ev.preventDefault()
  if (draggableElementIndex.value === null) return
  let targetElement
  if (ev.target.classList.contains('item')) {
    console.log(`зашли на сам элемент`)
    targetElement = ev.target
  } else if (ev.target.parentElement.classList.contains('item')) {
    console.log(`зашли на дочерний элемент`)
    targetElement = ev.target.parentElement

  } else {
    console.log(`зашли на обертку`)
    return
  }
  const targetElementIndex = Number(targetElement.dataset.index)
  if (targetElementIndex === draggableElementIndex.value) {
    console.log(`зашли на себя`)
    return
  }
}
</script>

<template>
  <div class="wrapper w-64 bg-amber-100 flex flex-col items-center p-4"
       @dragstart="handleDragStart" @dragend="handleDragEnd" @dragenter="handleDragEnter"
  >
    <div v-for="(item, index) in items" draggable="true"
         class="item m-2 px-6 py-2 bg-cyan-300 rounded-xl"
         :class="{'opacity-20': draggableElementIndex === index}"
         :key="item"
         :data-index="index"
    >
      <span class="bg-gray-100 p-1 rounded">{{ item }}</span>
    </div>
  </div>
</template>

<style  lang="scss">

</style>