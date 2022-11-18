<script setup>

// import myFetch from "~/composables/common/myFetch"
//
// const route = useRoute()
// const url = '/api/apiTest'
// console.log(`step1`)
// const {data, pending} = await myFetch(url, {
//   lazy: false,
//   auth: true,
//   from: route.path
// })
// console.log(`step2`)
const pending = ref(true)

console.log(`step1`)
let test = {}
if (process.server) {
  test.data = null
  test.pending = true
}
else {
  test = await useAsyncData('test', async () => {
    console.log(`from useAsyncData`)
    await timer(5)
    return 111
  }, {
    lazy: false, server: false
  })
}
console.log(`step2`)
console.log(`test: ${JSON.stringify(test, null, 2)}`)

async function timer(sec) {
  let promise = new Promise((resolve, reject) => {
    setTimeout(() => resolve(), sec * 1000)
  });
  return await promise;
}

</script>

<template>
  <div class="test_fetch">
    test: {{test.data}}
<!--    <HelperInlineLoader v-if="pending"/>-->
<!--    <TheTest v-else :data="data"/>-->
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