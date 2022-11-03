<script setup>
import useUser from "~/composables/state/useUser"
import {useLazyAsyncData} from "nuxt/app";
const { value: user } = useUser()

definePageMeta({
  // middleware: ["auth"]
  // middleware: 'auth'
})

const route = useRoute()
const url = '/api/getProduct?alias=' + route.params.p_alias
const {data: fetchData, pending} = await useLazyAsyncData(url, () => $fetch(url, {
  headers: {
    sessionToken: '111222333'
  }
}), {
  server: false,
  // transform: (data) => {
  //   console.log(`from transform`)
  //   if (data.status === 'no auth') {
  //     navigateTo('/user/login?from=' + route.path)
  //     return null
  //   }
  //   return data
  // }
})  // await будет только на сервере
console.log(`pending: ${JSON.stringify(pending, null, 2)}`)
// await navigateTo('/user/login?from=' + route.path)
</script>

<template>
  <div class="w-full p-2">
    <Transition name="page" mode="out-in">
      <HelperInlineLoader v-if="!fetchData"/>
      <ProductWrapper v-else :productData="fetchData"/>
    </Transition>
  </div>
</template>

