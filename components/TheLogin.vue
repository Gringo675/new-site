<script setup>
import useUser from "~/composables/user/useUser"
import getUser from "~/composables/user/getUser"
import refreshUser from "~/composables/user/refreshUser"
import {showNotice} from "~/composables/common/notice"

const user = useUser()
const router = useRouter()

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
  if (user.value.redirect) {
    // router.push(user.value.redirect).catch(err => {})
    // router.go(user.value.redirect)
    // await navigateTo(user.value.redirect)
  }
  user.value.showLogin = false
  delete user.value.redirect
}

const onRefresh = async () => {
  console.log(`before user: ${JSON.stringify(user, null, 2)}`)
  await refreshUser()
  console.log(`after user: ${JSON.stringify(user, null, 2)}`)
}

const onClose = () => {
  user.value.showLogin = false
  delete user.value.redirect
}

const onTest = () => {
  if (user.value.redirect) navigateTo(user.value.redirect)
  user.value.showLogin = false
  delete user.value.redirect
}
</script>

<template>
  <Transition name="transition-fade">
    <HelperModalWrapper v-if="user.showLogin">
      <div class="modal-form w-[800px] max-w-[95%] max-h-[90vh] bg-slate-200 p-2
         border border-amber-900 rounded-xl
         overflow-auto flex flex-col justify-start"
      >
        <div class="login">
          <h1>Login</h1>
          <button @click="onLogin" class="m-2 p-2 bg-cyan-500 rounded">Login</button>
          <button @click="onRefresh" class="m-2 p-2 bg-cyan-500 rounded">Refresh</button>
          <button @click="onClose" class="m-2 p-2 bg-cyan-500 rounded">Close</button>
          <button @click="onTest" class="m-2 p-2 bg-cyan-500 rounded">Test</button>
        </div>
      </div>
    </HelperModalWrapper>
  </Transition>
</template>

<style>

</style>