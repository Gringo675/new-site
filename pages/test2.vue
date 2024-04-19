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
  parent.value.addEventListener('mousedown', onParentMouseDown)
  parent.value.addEventListener('mousemove', onParentMouseMove)
  parent.value.addEventListener('mouseup', onParentMouseUp)
  parent.value.addEventListener('click', onParentClick)
  parent.value.addEventListener('touchstart', onParentTouchStart)
  parent.value.addEventListener('touchmove', onParentTouchMove)
  parent.value.addEventListener('touchend', onParentTouchEnd)
  useViewerEdgeImg(child)
})

const onParentMouseDown = event => {
  console.log(`onParentMouseDown`)
  // event.stopPropagation()
  // event.preventDefault()
}
const onParentMouseMove = event => {
  console.log(`onParentMouseMove`)
}
const onParentMouseUp = event => {
  console.log(`onParentMouseUp`)
  // event.preventDefault()
  // event.stopPropagation()
}
const onParentClick = event => {
  console.log(`onParentClick`)
}
const onParentTouchStart = event => {
  console.log(`onParentTouchStart`)
}
const onParentTouchMove = event => {
  console.log(`onParentTouchMove`)
}
const onParentTouchEnd = event => {
  console.log(`onParentTouchEnd`)
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
