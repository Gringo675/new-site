<script setup>
import dataFetch from "~/composables/common/dataFetch"

const route = useRoute()
const url = '/api/getCategory?alias=' + route.params.c_alias

const {data, pending} = await dataFetch(url)

</script>

<template>
  <div class="w-full p-2">
    <Transition name="page" mode="out-in">
      <HelperInlineLoader v-if="pending"/>
      <CatalogWrapper v-else :fetchData="data"/>
    </Transition>
  </div>
</template>

