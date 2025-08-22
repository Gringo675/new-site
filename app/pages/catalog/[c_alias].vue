<script setup>
const route = useRoute()
const url = `/api/getCategory/${route.params.c_alias}`
</script>

<template>
  <HelperDataFetch
    :url="url"
    v-slot="{ data }"
  >
    <CatalogWrapper :data />
  </HelperDataFetch>
</template>
