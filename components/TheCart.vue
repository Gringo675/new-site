<script setup>

import useUser from "~/composables/state/useUser"
const {value: user} = useUser()


// const response = await $fetch('/api/auth/refresh')
// console.log(`response: ${JSON.stringify(response, null, 2)}`)

onMounted(() => {

  setTimeout(async () => {
    // пытаемся обновить данные пользователя
    // const response = await $fetch('/api/auth/refresh')
    // console.log(`resnonse: ${JSON.stringify(response, null, 2)}`)
    // if (response.status === 'ok') {
    // user.isAuth = true
    // user.sessionToken = response.sessionToken
    // user.expiresToken = response.expires
    //   user.name = response.name
    //   user.isAdmin = response.isAdmin

    // }
  }, 3000)
})

</script>

<template>
  <div class="">
    TheCart
  </div>
</template>

<style>

</style>