<script setup>
//
useTitle('Результаты поиска')
const searchQuery = useRoute().params.s_query
const searchData = searchQuery.length > 2 ? await myFetch(`/api/getData/search?q=${searchQuery}`) : null
</script>

<template>
  <h1 class="font-accent my-4 text-2xl leading-7 max-xl:text-xl max-xl:leading-6">
    Результаты поиска по запросу "{{ searchQuery }}"
  </h1>
  <HelperAlarm
    v-if="searchQuery.length < 3"
    type="error"
    class="max-w-screen-xs mx-auto">
    <template #title>Минимальная длина поискового запроса - 3 символа.</template>
    Пожалуйста, уточните запрос.
  </HelperAlarm>
  <HelperAlarm
    v-else-if="!searchData.products?.length"
    type="error"
    class="max-w-screen-xs mx-auto">
    <template #title>Ничего не найдено!</template>
    Попробуйте изменить запрос.
  </HelperAlarm>
  <div v-else>
    <CatalogSearchWrapper :searchData />
  </div>
</template>
