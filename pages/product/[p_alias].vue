<script setup>

const route = useRoute()
const url = '/api/getProduct?alias=' + route.params.p_alias

</script>

<template>
  <HelperDataFetch :url="url" v-slot="{data}">
    <ProductWrapper :data="data" />
  </HelperDataFetch>
</template>