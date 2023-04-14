<script setup>

const user = useUser().value

const inputMail = ref('')
const isVerifyMail = ref(false)
const isGoogleInProcess = ref(false)

const onLogin = async () => {
  isVerifyMail.value = true
  try {
    // todo data verification
    const response = await myFetch('/api/auth/login', {method: 'post', payload: inputMail})
    user.sessionToken = response.sessionToken
    user.sessionExp = response.sessionExp

  } catch (e) {
    let notice
    switch (e.statusCode) {
      case 400:
        notice = 'Заполните почту и пароль!'
        break
      case 401:
        notice = 'Ошибка! Проверьте введенные почту и пароль!'
        break
      default:
        notice = 'Ошибка авторизации!'
    }
    showNotice(notice, 'error')
    return
  }
  await getUser()

  onClose()

}

const onGoogle = () => {
  isGoogleInProcess.value = true
  window.open('https://google.com')
}

const onClose = () => {
  user.showLogin = false
}

const onTest = () => {
  cv('from test')
  showNotice('some notice', 'info')
  // console.log(`user: ${JSON.stringify(user, null, 2)}`)
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
          <!--          header-->
          <div class="flex bg-emerald-200">
            <h1>Login</h1>
            <button @click="onTest" class="m-2 px-2 bg-cyan-500 rounded">Test</button>
            <button @click="onClose" class="m-2 px-2 bg-cyan-500 rounded">Close</button>
          </div>
          <template v-if="!isVerifyMail">
            <div>
              <span>Введите почту:</span>
              <input v-model="inputMail" type="email" class="mx-2" placeholder="a1->3"/>
              <button @click="onLogin" class="m-2 p-2 bg-cyan-500 rounded">Войти</button>
            </div>
            <div>
              <span>Или</span>
              <button @click="onGoogle" class="m-2 p-2 bg-cyan-500 rounded">Войти через google</button>
            </div>
          </template>
          <template v-else>
            <span>Проверочный код:</span>
            <input type="number" class="mx-2" placeholder="a1->3"/>
            <button class="m-2 p-2 bg-cyan-500 rounded">OK</button>
          </template>
        </div>
      </div>
    </HelperModalWrapper>
  </Transition>
</template>

<style>

</style>