<script setup>
//
const aaa = await useFetch('/api/apiTest')
</script>

<template>
  <div>
    <h1>Try page 1</h1>
    <pre>{{ aaa }}</pre>
  </div>
</template>
