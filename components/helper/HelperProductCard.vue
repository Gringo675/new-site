<script setup>
const props = defineProps({
  prod: Object,
})
</script>

<template>
  <div class="flex items-center">
    <NuxtLink :to="'/product/' + prod.alias"> {{ prod.name }} - {{ prod.price }} руб. без НДС </NuxtLink>
    <button
      class="m-2 px-2 py-1 bg-indigo-300 rounded-md"
      @click="addProductToCart(prod)"
    >
      To cart
    </button>
  </div>
</template>

<style></style>
