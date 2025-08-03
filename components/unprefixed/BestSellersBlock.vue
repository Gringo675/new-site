<script setup lang="ts">
//
const { data: bestSellers } = await useFetch('/api/getProducts', {
  method: 'post',
  body: { labelId: 5 },
})
</script>

<template>
  <ProductsSlider
    :products="bestSellers"
    label="Лидеры продаж" />
</template>
