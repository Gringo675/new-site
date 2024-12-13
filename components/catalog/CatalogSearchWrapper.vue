<script setup>
//
const { searchData } = defineProps({
  searchData: Object,
})
const products = searchData.products
const activeProductsIndx = Object.keys(products)
</script>

<template>
  <div>Найдено товаров: {{ searchData.products.length === 100 ? 'более' : '' }} {{ searchData.products.length }}</div>
  <HelperAsideGrid>
    <template #aside>
      <h2>В категориях:</h2>
      <div
        v-for="cat in searchData.cats"
        class="m-2"
      >
        <NuxtLink :to="'/catalog/' + cat.alias">{{ cat.name }}</NuxtLink>
        <div
          v-if="cat.children"
          class="pl-4"
        >
          <NuxtLink
            v-for="subCat in cat.children"
            :to="'/catalog/' + subCat.alias"
            class="block"
            >{{ subCat.name }}</NuxtLink
          >
        </div>
      </div>
    </template>
    <CatalogProductsWrapper
      :products
      :activeProductsIndx
    />
  </HelperAsideGrid>
</template>
