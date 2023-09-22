<script setup>

const breadCrumbs = useBreadCrumbs()

</script>

<template>
  <div class="my-2 px-3 w-fit bg-slate-300 rounded-md flex">
    <div><NuxtLink to="/">Home</NuxtLink></div>
    <div v-for="crumb in breadCrumbs">
      <span class="px-2">/</span>
      <NuxtLink :to="crumb.link">{{ crumb.name }}</NuxtLink>
    </div>
  </div>
</template>

<style>

</style>