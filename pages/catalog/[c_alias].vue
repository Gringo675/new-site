<script setup>

const route = useRoute()
const url = '/api/getCategory?alias=' + route.params.c_alias

</script>

<template>
  <HelperDataFetch :url="url" v-slot="{data}">
    <CatalogWrapper :data="data" />
  </HelperDataFetch>
</template>