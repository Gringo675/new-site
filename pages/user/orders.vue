<script setup>

import myFetch from "~/composables/common/myFetch"

let error

try {
  const data = await myFetch('/api/user/getOrders', {auth: true})

} catch (e) {
  error = e
}

// throw createError({ statusCode: 401, statusMessage: 'Page Not Found!!!!'})


</script>

<template>
  <TheError v-if="error" :error="error"/>
  <div v-else>
    orders
  </div>
</template>

<style>

</style>