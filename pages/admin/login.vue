<script setup>

definePageMeta({
  layout: "empty",
})

const user = useUser()
user.value.showLogin = true

</script>

<template>
  <div class="login">
    admin login
  </div>
</template>

<style>

</style>