<script setup>
const props = defineProps({
  prod: Object,
})
</script>

<template>
  <div class="flex items-center">
    <NuxtLink :to="'/product/' + prod.alias">
      {{ prod.name }} - {{ prod.price }}
      <sup v-if="prod.priceRegular">
        <del>{{ prod.priceRegular }}</del></sup
      >
      руб. без НДС
    </NuxtLink>
    <img
      v-if="prod.label"
      :src="getDynamicAsset('/img/labels/' + prod.label.image)"
      class="w-12"
    />
    <ClientOnly>
      <CatalogCartButton :prod="prod" />
    </ClientOnly>
  </div>
</template>
