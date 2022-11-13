<script setup>

import myFetch from "~/composables/common/myFetch";
const route = useRoute()
const url = '/api/apiTest'

// console.log(`HERE1`)
// showError({ statusCode: 400, statusMessage: 'Paggie Not Found!!!!'})
// console.log(`HERE2`)

const {data, pending, error} = await myFetch(url, {
  lazy: true,
  auth: false,
  server: true,
  from: route.path
})

// watchEffect(async () => { // следим за ошибками
//   if (!error.value) return
//   console.log(`watchEffect error: ${JSON.stringify(error.value, null, 2)}`)
//   if (error.value.statusCode === 511) {
//     console.log(`auth redirect`)
//     await navigateTo('/user/login?from=' + options.from)
//   }
//   else showError(error.value)
//   // else throw createError({ statusCode: 498, statusMessage: `Some error in 000}`})
// })

</script>

<template>
  <div class="test_fetch">
    <Transition name="page" mode="out-in">
      <HelperInlineLoader v-if="pending || error"/>
      <div v-else>
        data: {{data}}
      </div>
    </Transition>
  </div>
</template>

<style>

</style>