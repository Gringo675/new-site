<script setup>
import useUser from "~/composables/user/useUser"
import getUser from "~/composables/user/getUser"
import refreshUser from "~/composables/user/refreshUser"
import {showNotice} from "~/composables/common/notice"

const {value: user} = useUser()
const route = useRoute()
const pathTo = route.query.from || '/'

// const nuxtApp = useNuxtApp();
// console.log(`login nuxtApp._asyncData[key]: ${JSON.stringify(nuxtApp._asyncData[pathTo], null, 2)}`)


const onLogin = async () => {
  try {
    const response = await $fetch('/api/auth/login', {method: 'post', body: {mail: 'vik@mail.com', pass: '111222'}})
    // console.log(`login resnonse: ${JSON.stringify(response, null, 2)}`)
    user.sessionToken = response.sessionToken
    user.sessionExp = response.sessionExp

  } catch (e) {
    let message
    switch (e.statusCode) {
      case 400: message = 'Заполните почту и пароль!'
            break
      case 401: message = 'Ошибка! Проверьте введенные почту и пароль!'
            break
      default: message = 'Ошибка авторизации!'
    }
    showNotice(message, 'error')
    return
  }
  await getUser()
  navigateTo(pathTo)


}

const onRefresh = async () => {
  console.log(`before user: ${JSON.stringify(user, null, 2)}`)
  await refreshUser()
  console.log(`after user: ${JSON.stringify(user, null, 2)}`)
}

const onTest = () => {
  const nuxtApp = useNuxtApp()
  console.log(`nuxtApp._asyncData['/api/apiTest']: ${JSON.stringify(nuxtApp._asyncData['/api/apiTest'], null, 2)}`)
}
</script>

<template>
  <div class="login">
    <h1>Login</h1>
    <button @click="onLogin" class="m-2 p-2 bg-cyan-500 rounded">Login</button>
    <button @click="onRefresh" class="m-2 p-2 bg-cyan-500 rounded">Refresh</button>
    <button @click="onTest" class="m-2 p-2 bg-cyan-500 rounded">test</button>
  </div>
</template>

<style>

</style>