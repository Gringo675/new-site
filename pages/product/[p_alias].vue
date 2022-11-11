<script setup>
import useAuthFetch from "~/composables/common/useAuthFetch";

// import useUser from "~/composables/user/useUser"
// import refreshUser from "~/composables/user/refreshUser"

// const {value: user} = useUser()

// definePageMeta({
//   middleware: ["auth"]
//   middleware: 'auth'
// })

const route = useRoute()
const url = '/api/getProduct?alias=' + route.params.p_alias

const data = await useAuthFetch(url, route.path)

// console.log(`data.value: ${JSON.stringify(data.value, null, 2)}`)
</script>

<template>
  <div class="w-full p-2">
    <Transition name="page" mode="out-in">
      <ProductWrapper v-if="data" :productData="data"/>
      <HelperInlineLoader v-else/>
    </Transition>
  </div>
</template>

