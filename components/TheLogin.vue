<script setup>
const user = useUser().value

const form = reactive({
  mail: 'gringo675g@gmail.com',
  code: '',
  verifyScreen: false,
})
const isMailValid = computed(() => validateMail(form.mail))

const sendCode = async () => {
  if (!isMailValid.value) {
    showNotice('Введите корректный адрес!', 'error')
    return
  }

  const isCodeSend = await myFetch('/api/auth/login/createCode', {
    method: 'post',
    payload: { mail: form.mail },
  })

  if (isCodeSend) {
    form.verifyScreen = true
    getUserTimer.run()
  }
}

const getUserTimer = {
  // если юзер зашел по ссылке в письме, на сайт установится cookie refreshToken
  // данный таймер позволяет автоматически залогиниться и на странице ввода кода
  timer: null,
  run() {
    this.timer = setInterval(async () => {
      await getUser({ hidden: true })
      if (user.auth) {
        this.stop()
        closeLogin()
      }
    }, 5000)
  },
  stop() {
    clearInterval(this.timer)
  },
}

const isCodeValid = ref(false)
watch(isCodeValid, async value => {
  // запускаем верификацию
  if (value) await verifyCode()
})

const verifyCode = async () => {
  const verified = await myFetch('/api/auth/login/verifyCode', {
    method: 'post',
    payload: {
      mail: form.mail,
      code: form.code,
    },
  })

  if (verified) {
    getUserTimer.stop()
    await getUser()
    closeLogin()
    showNotice('Успех!', 'success')
  } else {
    isCodeValid.value = null
    showNotice('Неверный код!', 'error')
  }
}

const backOnMailScreen = () => {
  form.verifyScreen = false
  form.code = ''
  getUserTimer.stop()
}

const runOAuth = provider => {
  showLoader()
  const url = getOAuthURL(provider)
  const oauthWinParams = `status=no,location=no,toolbar=no,menubar=no,width=500,height=500,left=200,top=0`
  const oauthWin = window.open(url, 'oauth', oauthWinParams)
  const timer = setInterval(async () => {
    if (oauthWin.closed) {
      clearInterval(timer)
      await getUser({ hidden: true })
      hideLoader()
      if (user.auth) closeLogin()
    }
  }, 1000)
}

const closeLogin = () => {
  getUserTimer.stop()
  user.showLogin = false
}

const onTest = () => {
  cv('from test')

  // showNotice('some notice', 'info')
  // console.log(`user: ${JSON.stringify(user, null, 2)}`)
}
</script>

<template>
  <div
    class="modal-form w-[800px] max-w-[95%] max-h-[90vh] bg-slate-200 p-2 border border-amber-900 rounded-xl overflow-auto flex flex-col justify-start"
  >
    <div class="login">
      <!--          header-->
      <div class="flex bg-emerald-200">
        <h1>Login</h1>
        <button
          @click="onTest"
          class="m-2 px-2 bg-cyan-500 rounded"
        >
          Test
        </button>
        <button
          @click="closeLogin"
          class="m-2 px-2 bg-cyan-500 rounded"
        >
          Close
        </button>
      </div>
      <template v-if="user.auth">
        <div>Вы вошли на сайт под именем {{ user.name }}.</div>
      </template>
      <template v-else>
        <!-- mailScreen -->
        <template v-if="!form.verifyScreen">
          <div>
            <span>Введите почту:</span>
            <input
              v-model="form.mail"
              type="text"
              v-focus
              class="mx-2 border-2 some-very-big-class"
              :class="{ ' border-green-500': isMailValid }"
            />
            <button
              @click="sendCode"
              :disabled="!isMailValid"
              class="m-2 p-2 bg-cyan-500 rounded"
            >
              Получить код
            </button>
          </div>
          <div>
            <span>Или</span>
            <button
              @click="runOAuth('google')"
              class="m-2 p-2 bg-cyan-500 rounded"
            >
              Войти через google
            </button>
            <button
              @click="runOAuth('vk')"
              class="m-2 p-2 bg-cyan-500 rounded"
            >
              Войти через VK
            </button>
            <button
              @click="runOAuth('mailru')"
              class="m-2 p-2 bg-cyan-500 rounded"
            >
              Войти через mail.ru
            </button>
          </div>
        </template>
        <!-- verifyScreen -->
        <template v-else>
          <div>На почту {{ form.mail }} было отправлено письмо, содержащее код для входа на сайт...</div>
          <div>
            <button
              @click="backOnMailScreen"
              class="m-2 p-2 bg-cyan-500 rounded"
            >
              Назад
            </button>
            <input
              v-mask.code="form.code"
              @maskData="form.code = $event.detail.value"
              @maskComplete="isCodeValid = $event.detail.value"
              type="text"
              maxlength="5"
              v-focus
              class="mx-2 text-4xl w-28 border-2"
              :class="{ 'border-green-500': isCodeValid, 'border-red-500': isCodeValid === null }"
            />
          </div>
        </template>
      </template>
    </div>
  </div>
</template>
