<script setup>
const route = useRoute()
// console.log(`route: ${JSON.stringify(route, null, 2)}`)
const url = `/api/getContent/${String(route.name)}`
</script>

<template>
  <HelperDataFetch
    :url="url"
    v-slot="{ data }"
  >
    <article v-html="data"></article>
  </HelperDataFetch>
</template>
