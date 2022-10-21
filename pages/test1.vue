<script setup>

const { data, pending } = await useAsyncData('test1', () => $fetch('/api/apiTest'))

data.value['Current time'] = 'noooone'
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
  </div>
</template>

<style>

</style>