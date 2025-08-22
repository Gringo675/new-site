<script setup>
//
const data = await myFetch('/api/admin/getProducts')
</script>

<template>
  <HelperAdminOnly>
    <h1>products</h1>
    <div>{{ data }}</div>
  </HelperAdminOnly>
</template>
