<script setup>
//
const data = await myFetch('/api/admin/getProducts')
</script>

<template>
  <h1>products</h1>
  <div>{{ data }}</div>
</template>
