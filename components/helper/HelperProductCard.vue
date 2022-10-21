<script setup>

const props = defineProps({
  prod: Object
})


</script>

<template>
  <div class="">
    <NuxtLink :to="'/product/' + prod.alias">
      {{ prod.name }} - {{ prod.price }} руб. без НДС
    </NuxtLink>
  </div>
</template>

<style>

</style>