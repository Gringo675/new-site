<script setup>

const test = await useCatProps2()
console.log(`test: ${JSON.stringify(test)}`);
// console.log(`test: ${test.value}`)

</script>

<template>
  <div class="TheTest">
THE TEST component {{ test }}
  </div>
</template>

<style lang="scss">
.TheTest {
}
</style>