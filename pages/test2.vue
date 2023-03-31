<script setup>
const time = await useTime()
console.log(`test2 time.pending.value: ${JSON.stringify(time.pending.value, null, 2)}`)
console.log(`test2 time.data.value: ${JSON.stringify(time.data.value, null, 2)}`)
</script>

<template>
  <h1>Test2</h1>
  <div>time: {{time.data}}</div>
</template>