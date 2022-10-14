<script setup>

const test = await useTest();
console.log(`pending: ${test.pending.value} data: ${test.data.value}`);

</script>

<template>
  <div class="TheTest">
THE TEST component data: {{ test.data }}
  </div>
</template>

