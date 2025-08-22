<script setup>
const props = defineProps({
  prod: Object,
})
</script>

<template>
  <div class="flex items-center">
    <NuxtLink :to="'/product/' + prod.alias"> {{ prod.name }} - {{ prod.price }} руб. без НДС </NuxtLink>
    <CatalogCartButton />
  </div>
</template>
