<script setup>
//
console.log(`from test page1`)
const test = await useTest()
console.log(`test: ${JSON.stringify(test, null, 2)}`)
</script>

<template>
  <h1>Test1</h1>
  <div>
    {{ test }}
  </div>
</template>
