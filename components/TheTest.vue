<script setup>
//
const props = defineProps({
  ccc: Array,
  ddd: Array,
})
const ccc = reactive(props.ccc)
const cccIfRef = isRef(ccc)
const cccIfReactive = isReactive(ccc)
console.log(`cccIfRef: ${JSON.stringify(cccIfRef, null, 2)}`)
console.log(`cccIfReactive: ${JSON.stringify(cccIfReactive, null, 2)}`)

const ddd = props.ddd
const dddIfRef = isRef(ddd)
const dddIfReactive = isReactive(ddd)
console.log(`dddIfRef: ${JSON.stringify(dddIfRef, null, 2)}`)
console.log(`dddIfReactive: ${JSON.stringify(dddIfReactive, null, 2)}`)
</script>

<template>
  <div>ccc: {{ ccc }}</div>
  <div>ddd: {{ ddd }}</div>
</template>
