<script setup>
import useUser from "~/composables/state/useUser"
const { value: user } = useUser()
const route = useRoute()
const pathTo = route.query.from || '/'

const onLogin = () => {
  user.isAuth = true
  navigateTo(pathTo)
}
</script>

<template>
  <div class="login">
    <h1>Login</h1>
    <button @click="onLogin" class="m-2 p-2 bg-cyan-500 rounded">Login</button>
  </div>
</template>

<style>

</style>