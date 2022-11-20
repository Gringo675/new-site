<script setup>

// import myFetch from "~/composables/common/myFetchOld"
import myFetch from "~/composables/common/myFetch"

const route = useRoute()
const url = '/api/apiTest'
const {data, pending} = await myFetch(url, {
  lazy: true,
  auth: false,
  from: route.path
})


// console.log(`step1`)
// let test = {}
// if (process.server) {
//   test.data = null
//   test.pending = true
// }
// else {
//   test = await useAsyncData('test', async () => {
//     console.log(`from useAsyncData`)
//     await timer(3)
//     return 111
//   }, {
//     lazy: false, server: false
//   })
// }
// console.log(`step2`)
// console.log(`test: ${JSON.stringify(test, null, 2)}`)

async function timer(sec) {
  let promise = new Promise((resolve, reject) => {
    setTimeout(() => resolve(), sec * 1000)
  });
  return promise;
}

</script>

<template>
  <div class="test_fetch">
<!--    test: {{test.data ? test.data : ''}}-->
    <HelperInlineLoader v-if="pending"/>
    <TheTest v-else :data="data" :pending="pending"/>
    <!--    <Transition name="page" mode="out-in">-->
    <!--      <HelperInlineLoader v-if="pending"/>-->
    <!--      <TheTest v-else />-->
    <!--      <TheTest v-if="!pending && !error"/>-->
    <!--      <HelperInlineLoader v-else />-->
    <!--    </Transition>-->
  </div>
</template>

<style>

</style>