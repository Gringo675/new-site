<script setup lang="ts">
//
const { data: bestSellers } = await useFetch('/api/getData/products?lId=5')
</script>

<template>
  <ProductsSlider
    data-testid="best-sellers-block"
    :products="bestSellers"
    label="Лидеры продаж" />
</template>
