<script setup>
definePageMeta({
  // middleware: ["auth"]
  middleware: 'auth'
})

const route = useRoute()
const url = '/api/getProduct?alias=' + route.params.p_alias
const {data: fetchData, pending} = await useLazyAsyncData(url, () => $fetch(url))

</script>

<template>
  <div class="w-full p-2">
    <Transition name="page" mode="out-in">
      <HelperInlineLoader v-if="pending"/>
      <ProductWrapper v-else :productData="fetchData"/>
    </Transition>
  </div>
</template>

