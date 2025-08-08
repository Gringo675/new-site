<script setup>
//
const onResolved = item => {
  console.log('Resolved:', item)
}
</script>

<template>
  <div class="m-10 bg-gray-800 p-4">
    <HelperInputMenu @resolved="onResolved">
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
                class="text-sm leading-tight underline-offset-4 hover:underline"
                :to="`/catalog/${subCat.alias}`"
                @click="resolve(`/catalog/${subCat.alias}`)">
                {{ subCat.name }}
              </NuxtLink>
            </template>
          </div>
          <!-- products -->
          <div class="flex flex-col items-start gap-y-1 rounded-lg bg-violet-50 p-2 pt-1">
            <div class="-mb-1 self-end text-sm font-semibold">Товары</div>
            <NuxtLink
              v-for="product in searchState.result.products"
              class="text-sm leading-tight underline-offset-4 hover:underline"
              :to="`/product/${product.alias}`"
              @click="resolve(`/product/${product.alias}`)">
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
          class="bg-violet-100 p-2">
          Нет результатов! Попробуйте изменить запрос.
        </div>
      </template>
    </HelperInputMenu>
  </div>
</template>
