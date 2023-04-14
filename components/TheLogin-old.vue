<script setup>

const user = useUser().value

const inputData = reactive({
  mail: '',
  pass: ''
})

const onLogin = async () => {
  try {
    // todo data verification
    const response = await myFetch('/api/auth/login', {method: 'post', payload: inputData})
    user.sessionToken = response.sessionToken
    user.sessionExp = response.sessionExp

  } catch (e) {
    let notice
    switch (e.statusCode) {
      case 400: notice = 'Заполните почту и пароль!'
        break
      case 401: notice = 'Ошибка! Проверьте введенные почту и пароль!'
        break
      default: notice = 'Ошибка авторизации!'
    }
    showNotice(notice, 'error')
    return
  }
  await getUser()

  onClose()

}

const onRefresh = async () => {
  console.log(`before user: ${JSON.stringify(user, null, 2)}`)
  await refreshUser()
  console.log(`after user: ${JSON.stringify(user, null, 2)}`)
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
          <h1>Login</h1>
          <div>
            <input v-model="inputData.mail" class="mx-2" type="password" placeholder="a->3"/>
            <input v-model="inputData.pass" type="password" placeholder="1->3"/>
          </div>
          <div>
            <button @click="onLogin" class="m-2 p-2 bg-cyan-500 rounded">Login</button>
            <!--            <button @click="onRefresh" class="m-2 p-2 bg-cyan-500 rounded">Refresh</button>-->
            <button @click="onClose" class="m-2 p-2 bg-cyan-500 rounded">Close</button>
            <button @click="onTest" class="m-2 p-2 bg-cyan-500 rounded">Test</button>
          </div>
        </div>
      </div>
    </HelperModalWrapper>
  </Transition>
</template>

<style>

</style>