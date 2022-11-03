<script setup>
import useUser from "~/composables/state/useUser"
const { value: user } = useUser()
const route = useRoute()
const pathTo = route.query.from || '/'

const onLogin = async () => {

  const response = await $fetch('/api/auth/login', {method: 'post', body: {mail: 'vik@mail.com', pass: '111222'} })

  console.log(`resnonse: ${JSON.stringify(response, null, 2)}`)
  if (response.status === 'ok') {
    user.isAuth = true
    user.name = response.name
    user.isAdmin = response.isAdmin
    user.sessionToken = response.sessionToken
    user.expiresToken = response.expires

    // navigateTo(pathTo)
  }

}

const onRefresh = () => {
  $fetch('/api/auth/refresh')
}
</script>

<template>
  <div class="login">
    <h1>Login</h1>
    <button @click="onLogin" class="m-2 p-2 bg-cyan-500 rounded">Login</button>
    <button @click="onRefresh" class="m-2 p-2 bg-cyan-500 rounded">Refresh</button>
  </div>
</template>

<style>

</style>