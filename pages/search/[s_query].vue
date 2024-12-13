<script setup>
//
const searchQuery = useRoute().params.s_query
const searchData = searchQuery.length > 2 ? await myFetch(`/api/getSearch?q=${searchQuery}`) : null
</script>

<template>
  <h1>Результаты поиска по запросу "{{ searchQuery }}"</h1>
  <div v-if="searchQuery.length < 3">
    Минимальная длина поискового запроса - 3 символа. Пожалуйста, уточните запрос.
  </div>
  <div v-else-if="!searchData">Ничего не найдено! Попробуйте изменить запрос.</div>
  <!-- results -->
  <div v-else>
    <CatalogSearchWrapper :searchData />
  </div>
</template>
