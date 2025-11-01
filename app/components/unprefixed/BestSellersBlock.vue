<script setup lang="ts">
//
const { data: bestSellers } = await useFetch('/api/getData/products?lId=5')
</script>

<template>
  <ProductsSlider
    :products="bestSellers"
    label="Лидеры продаж" />
</template>
