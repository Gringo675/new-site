<script setup>

import myFetch from "~/composables/common/myFetch";
const route = useRoute()
const url = '/api/apiTest'

console.log(`HERE1`)
// showError({ statusCode: 400, statusMessage: 'Pagge Not Found!!!!'})
throw createError({ statusCode: 401, statusMessage: `Some error`, fatal: false})
console.log(`HERE2`)

const pending = false
const data = false


// const {data, pending} = await myFetch(url, {
//   lazy: true,
//   auth: false,
//   server: true,
//   from: route.path
// })

</script>

<template>
  <div class="test_fetch">
    <Transition name="page" mode="out-in">
      <HelperInlineLoader v-if="pending"/>
      <div v-else>
        data: {{data}}
      </div>
    </Transition>
  </div>
</template>

<style>

</style>