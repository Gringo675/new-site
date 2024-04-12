<script setup>
//
definePageMeta({
  layout: 'empty',
})

const parent = ref(null)
const child = ref(null)
let second = null
// onMounted(() => {
//   // parent.value.addEventListener('click', () => console.log(`parent click`))
//   // child.value = parent.value.children[0]
//   // const rect = child.value.getBoundingClientRect()
//   // console.log(`rect: ${JSON.stringify(rect, null, 2)}`)
//   // child.value.style = 'border: 2px solid red'
//   // second = child.value.$el.children[1]
//   // second.style = 'border: 2px solid red'
// })

onMounted(() => {
  parent.value.addEventListener('mousedown', onParentMouseDown, { capture: false })
  parent.value.addEventListener('mouseup', onParentMouseUp)
  parent.value.addEventListener('click', onParentClick)
  child.value.addEventListener('mousedown', onChildMouseDown)
  child.value.addEventListener('mouseup', onChildMouseUp)
  child.value.addEventListener('click', onChildClick)
})

const onParentMouseDown = event => {
  console.log(`onParentMouseDown`)
  // event.stopPropagation()
  // event.preventDefault()
}
const onParentMouseUp = event => {
  console.log(`onParentMouseUp`)
  event.preventDefault()
  // event.stopPropagation()
}
const onParentClick = event => {
  console.log(`onParentClick`)
}
const onChildMouseDown = event => {
  console.log(`onChildMouseDown`)
}
const onChildMouseUp = event => {
  console.log(`onChildMouseUp`)
}
const onChildClick = event => {
  console.log(`onChildClick`)
}
</script>

<template>
  <div
    ref="parent"
    class="parent w-[500px] h-[500px] flex items-center justify-center bg-slate-400"
  >
    <div
      ref="child"
      class="child w-[200px] h-[200px] bg-yellow-200"
    ></div>
  </div>
</template>
