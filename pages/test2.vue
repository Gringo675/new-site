<script setup>

// const { data, pending } = useLazyAsyncData('test2', () => $fetch('/api/apiTest'), {
//   transform: (data) => data + ' from test2'
// })
let { data, pending, error } = await useLazyAsyncData('test2', () => $fetch('/api/apiTest'), {
  transform: (data) => data
})
if (error.value) throw createError({ statusCode: 404, statusMessage: 'Page Not Found!!!!'})
const vTime = ref()
let vData
// watch(data, () => (
//     vData.value = data.value + ' from test2'
// ))
watchEffect(() => {
  if (!data.value) return
  vTime.value = data.value['Current time']
  vData = JSON.parse(JSON.stringify(data.value.aaa))
  // data = undefined


})

const handleButton = () => {
  console.log(`data: ${JSON.stringify(data, null, 2)}`)
}
</script>

<template>
  <div class="">
      <h1>Test2</h1>
    <div class="m-2 p-2 ">
      <NuxtLink to="/test1" class="text-sky-600">to test1</NuxtLink>
    </div>
    <div>
      Pending - {{ pending }}
    </div>
    <div>
      Data - {{ data }}
    </div>
    <div>
      vTime - {{ vTime }}
    </div>
    <button @click="handleButton">Test</button>
  </div>
</template>

<style>

</style>