<script setup>
//
const route = useRoute()

const url = `/api/getData/category/${route.params.c_alias}`
</script>

<template>
  <HelperDataFetch
    :url="url"
    v-slot="{ data }">
    <CatalogWrapper :data />
  </HelperDataFetch>
</template>
