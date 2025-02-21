<script setup>
//
definePageMeta({
  layout: 'empty',
})
const state = reactive([
  { id: 1, vl: 1 },
  { id: 2, vl: 2 },
  { id: 3, vl: 3 },
  { id: 4, vl: 4 },
  // { id: 5, vl: 5 },
])

watch(state, (newState, oldState) => {
  console.log(`from watcher`)
  const zeroIndex = newState.findIndex(item => Number(item.vl) === 0)
  if (zeroIndex === -1) {
    doSideEffect()
  } else {
    // запустит watcher еще раз}
    console.log(`oldState[zeroIndex].vl: ${JSON.stringify(oldState[zeroIndex].vl, null, 2)}`)
    newState[zeroIndex].vl = oldState[zeroIndex].vl
    // state.splice(zeroIndex, 1)
  }
})

const doSideEffect = () => {
  console.log(`from doSideEffect`)
}
</script>

<template>
  <div class="">{{ state }}</div>
  <div class="">
    <div
      v-for="(item, i) in state"
      class=""
    >
      <UInput v-model.lazy="item.vl" />
    </div>
  </div>
</template>
