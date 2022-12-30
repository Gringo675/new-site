<script setup>

const test = async () => {
  const data = await $fetch('/api/lpTest')
  console.log(`data: ${JSON.stringify(data, null, 2)}`)
}

</script>

<template>
  <div class="">
      <h1>Test2</h1>
      <button class="button" @click="test">Test</button>
  </div>
</template>
