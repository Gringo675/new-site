<script setup>

definePageMeta({
  layout: "empty",
})

const user = useUser()
user.value.showLogin = true

</script>

<template>
  <div class="login">
    <h1>admin login</h1>
    <button class="button">
      <NuxtLink to="/">На главную</NuxtLink>
    </button>
  </div>
</template>

<style>

</style>