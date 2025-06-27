<script setup>
//
useSeoMeta({
  title: 'Результаты поиска',
})
const searchQuery = useRoute().params.s_query
const searchData = searchQuery.length > 2 ? await myFetch(`/api/getSearch?q=${searchQuery}`) : null
</script>

<template>
  <h1 class="font-accent my-4 text-2xl leading-7 max-xl:text-xl max-xl:leading-6">
    Результаты поиска по запросу "{{ searchQuery }}"
  </h1>
  <HelperAlarm
    v-if="searchQuery.length < 3"
    title="Минимальная длина поискового запроса - 3 символа."
    description="Пожалуйста, уточните запрос."
    type="error"
    class="max-w-screen-xs mx-auto"
  />
  <HelperAlarm
    v-else-if="!searchData.products?.length"
    title="Ничего не найдено!"
    description="Попробуйте изменить запрос."
    type="error"
    class="max-w-screen-xs mx-auto"
  />
  <div v-else>
    <CatalogSearchWrapper :searchData />
  </div>
</template>
