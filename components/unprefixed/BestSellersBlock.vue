<script setup>
//
const bestSellers = await useFetch('/api/getProducts', {
  method: 'post',
  body: { labelId: 5 }, // Assuming labelId 5 is for best sellers
})
</script>

<template>
  <ProductsSlider
    :products="bestSellers.data"
    label="Лидеры продаж" />
  <div class="">{{ bestSellers }}</div>
</template>
