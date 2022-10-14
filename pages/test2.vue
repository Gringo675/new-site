<script setup>

const { data } = await useLazyAsyncData('test2', () => $fetch('/api/apiTest'))

</script>

<template>
  <div class="">
      <h1>Test2</h1>
    <div class="m-2 p-2 ">
      <NuxtLink to="/test1" class="text-sky-600">to test1</NuxtLink>
    </div>
    <div>
      data - {{ data }}
    </div>
  </div>
</template>

<style>

</style>