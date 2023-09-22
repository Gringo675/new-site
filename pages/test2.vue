<script setup>
//

const test = await useTest()
console.log(`test: ${JSON.stringify(test, null, 2)}`)
</script>

<template>
  <h1>Test2</h1>
  <div>
    {{ test }}
  </div>
</template>
