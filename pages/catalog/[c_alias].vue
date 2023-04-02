<script setup>
// const nuxtApp = useNuxtApp();
// const isHydr = nuxtApp.isHydrating
// console.log(`isHydr: ${JSON.stringify(isHydr, null, 2)}`)

const route = useRoute()
const url = '/api/getCategory?alias=' + route.params.c_alias

let pending = ref(false)
let error = ref(false)
let data = useNuxtData(url).data
// console.log(`data: ${JSON.stringify(data, null, 2)}`)
// watch(error, (value)=>{
//   console.log(`from watch`)
//   throw createError(value)
// })
if (!data.value) {
  ({pending, data, error} = useLazyAsyncData(url, async () => {
    try {
      return await $fetch(url)
    } catch (e) {
      console.log(`e: ${JSON.stringify(e, null, 2)}`)
      throw createError(e)
      // throwError(e)
      // error.value = true
      // const err = useError()
      // err.value = e
      // showError(e)
      // throw createError({statusCode: 505, statusMessage: 'some mess'})
    }
  }))
watch(error, (value)=>{
  console.log(`from watch error: ${JSON.stringify(value, null, 2)}`)
  throw createError(value)
})
}


</script>

<template>
  <!--  <HelperDataFetch :url="url" v-slot="{data}">-->
  <!--    <CatalogWrapper :data="data" />-->
  <!--  </HelperDataFetch>-->
  <div v-if="!error">
    <div v-if="pending">
      Loading...
    </div>
    <CatalogWrapper v-else :data="data"/>
  </div>
</template>