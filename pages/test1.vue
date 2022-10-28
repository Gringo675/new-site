<script setup>

const { data, pending, error } = await useAsyncData('test1', () => $fetch('/api/apiTest'))

if (error.value) {
  console.log(`error: ${JSON.stringify(error, null, 2)}`)
  showError({statusCode: 404, statusMessage: 'Page Not Found!!!!'})
}

</script>

<template>
  <div class="">
    <h1>Test1</h1>
    <div class="m-2 p-2 ">
      <NuxtLink to="/test2" class="text-sky-600">to test2</NuxtLink>
    </div>
    <div>
      pending - {{ pending }}
    </div>
    <div>
      data - {{ data }}
    </div>
    <div>
      error - {{ error }}
    </div>
  </div>
</template>

<style>

</style>