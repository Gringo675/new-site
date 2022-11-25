<script setup>
import dataFetch from "~/composables/common/dataFetch"

const route = useRoute()
const url = '/api/getProduct?alias=' + route.params.p_alias

const {data, pending} = await dataFetch(url)

</script>

<template>
  <div class="w-full p-2">
    <Transition name="page" mode="out-in">
      <HelperInlineLoader v-if="pending"/>
      <ProductWrapper v-else :productData="data" />
    </Transition>
  </div>
</template>

