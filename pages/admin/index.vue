<script setup>

await myFetch('/api/user/isAdmin', {auth: true}) // если не админ, выкинет ошибку

</script>

<template>
  <div class="index">
<div>
  <button class="button">
    <NuxtLink to="/admin/categories">Менеджер категорий</NuxtLink>
  </button>
</div>
  </div>
</template>

<style>

</style>