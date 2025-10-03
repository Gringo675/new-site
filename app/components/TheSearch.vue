<script setup>
//
const onResolved = link => {
  if (link) navigateTo(link)
  hideCatsMenu() // для модуля поиска в боковом меню
}
</script>

<template>
  <HelperInputMenu
    forCatalog
    @resolved="onResolved"
    class="w-112">
    <template #result="{ searchState, resolve }">
      <div
        v-if="searchState.result.products.length > 0"
        class="">
        <!-- categories -->
        <div class="flex flex-col items-start gap-y-1 p-2 pt-1">
          <div class="-mb-2 self-end text-sm font-semibold">Категории</div>
          <template v-for="cat in searchState.result.cats">
            <NuxtLink
              v-for="subCat in cat.children"
              :to="`/catalog/${subCat.alias}`"
              @click="resolve"
              class="text-sm leading-tight underline-offset-4 hover:underline">
              {{ subCat.name }}
            </NuxtLink>
          </template>
        </div>
        <!-- products -->
        <div class="flex flex-col items-start gap-y-1 rounded-lg bg-violet-50 p-2 pt-1">
          <div class="-mb-1 self-end text-sm font-semibold">Товары</div>
          <NuxtLink
            v-for="product in searchState.result.products"
            :to="`/product/${product.alias}`"
            @click="resolve"
            class="text-sm leading-tight underline-offset-4 hover:underline">
            {{ product.name }}
          </NuxtLink>
        </div>
        <div class="flex justify-between p-2">
          <UButton
            variant="ghost"
            color="tertiary"
            label="Все результаты"
            @click="resolve(`/search/${searchState.query}`)" />
          <UButton
            color="neutral"
            variant="link"
            icon="i-heroicons-x-mark"
            class="p-0"
            @click="searchState.showResults = false" />
        </div>
      </div>
      <div
        v-else
        class="p-2">
        Нет результатов! Попробуйте изменить запрос.
      </div>
    </template>
  </HelperInputMenu>
</template>
