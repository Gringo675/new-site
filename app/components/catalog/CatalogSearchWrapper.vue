<script setup>
//
const { searchData } = defineProps({
  searchData: Object,
})
const products = searchData.products
const activeProductsIndx = Object.keys(products)
</script>

<template>
  <HelperAsideGrid>
    <template #aside>
      <div class="font-bold">
        Найдено товаров: {{ searchData.total > 100 ? '100+ (попробуйте уточнить запрос)' : searchData.total }}
      </div>

      <div class="my-2 rounded-lg bg-violet-100 p-2 pr-1">
        <div class="mb-2 text-lg italic underline underline-offset-4">В категориях:</div>
        <div class="menu-scrollbar max-xs:max-h-20 flex flex-col gap-2 overflow-auto pr-1 max-md:max-h-40">
          <div
            v-for="cat in searchData.cats"
            class="">
            <NuxtLink
              class="leading-tight text-indigo-500 underline-offset-4 hover:underline"
              :to="'/catalog/' + cat.alias"
              >{{ cat.name }}</NuxtLink
            >
          </div>
        </div>
      </div>
    </template>
    <CatalogProductsWrapper
      :products
      :activeProductsIndx />
  </HelperAsideGrid>
</template>
