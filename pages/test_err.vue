<script setup>

const url = '/api/apiTest'
// await clearNuxtData(url)
// const {data, pending, error} = await useAsyncData(url, () => $fetch(url))
const {data, pending, error} = await useLazyAsyncData(url, async () => {
  try {
    return  await $fetch(url)
  } catch (e) {
    console.log(`catch e: ${e.statusCode}`);
    // if (e.statusCode === 511) return navigateTo('/user/login')
    throw createError({ statusCode: e.statusCode, statusMessage: e.statusMessage, fatal: true })
    return null
  }

})



// const errors = useState('_errors')
// console.log(`errors: ${JSON.stringify(errors, null, 2)}`)

// const errors = useError(url)
// console.log(`errors: ${JSON.stringify(errors, null, 2)}`)

// if (!data.value) {
//   throw createError({ statusCode: 401, statusMessage: 'Pagggge Not Found', fatal: false })
// }
const handleError = async (error) => {
  if (error.statusCode === 511) await navigateTo('/user/login')
  // else throw createError(error)
  // throw createError({ statusCode: 498, statusMessage: `Some error in 000}`})
  else showError(error)
}
watch(error, () => { // на клиенте
  console.log(`watch error: ${JSON.stringify(error.value, null, 2)}`)
  handleError(error.value)
})
if (error.value) { // на сервере
  console.log(`if error: ${JSON.stringify(error.value, null, 2)}`)
  handleError(error.value)
  // throw createError({ statusCode: error.value.statusCode, statusMessage: error.value.statusMessage, fatal: false })
}


onUnmounted(() => {
  console.log(`unmount`);
  clearNuxtData(url)
})

</script>

<template>
  <div class="test_err">
    <div> data: {{data}}</div>
    <div> pending: {{pending}}</div>
<!--    <div>data.aaa.length: {{data.aaa.length}}</div>-->
<!--    <div> error: {{error}}</div>-->
  </div>
</template>
