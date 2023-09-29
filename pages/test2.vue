<script setup>
//
await new Promise(resolve => setTimeout(resolve, 10000))
const cTime = new Date().toLocaleTimeString()
console.log(`from test2: ${cTime}`)
</script>

<template>
  <h1>Test2</h1>
  <div></div>
</template>
