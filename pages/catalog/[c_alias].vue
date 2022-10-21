<script setup>

const route = useRoute()
const url = '/api/getCategory?alias=' + route.params.c_alias
const {data: fetchData, pending} = await useLazyAsyncData(url, () => $fetch(url))

</script>

<template>
  <div class="w-full p-2">
    <Transition name="page" mode="out-in">
      <HelperInlineLoader v-if="pending"/>
      <CatalogWrapper v-else :fetchData="fetchData"/>
    </Transition>
  </div>
</template>

