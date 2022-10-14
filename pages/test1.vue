<script setup>

const { data } = useAsyncData('test1', () => $fetch('/api/apiTest'))
</script>

<template>
  <div class="">
    <h1>Test1</h1>
    <div class="m-2 p-2 ">
      <NuxtLink to="/test2" class="text-sky-600">to test2</NuxtLink>
    </div>
    <div>
      data - {{ data }}
    </div>
  </div>
</template>

<style>

</style>