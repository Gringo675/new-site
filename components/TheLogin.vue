<script setup>

const user = useUser().value

const form = reactive({
  mail: '',
  code: '',
  verifyScreen: false
})

const sendCode = async () => {
  // todo: verify mail
  //   const notice = 'Некорректный адрес!'
  //   showNotice(notice, 'error')
  // return

  const isCodeSend = await myFetch('/api/auth/login-create-code', {
    method: 'post',
    payload: {mail: form.mail}
  })

  if (isCodeSend) {
    form.verifyScreen = true
  }

}

const verifyCode = async () => {

  const verified = await myFetch('/api/auth/login-verify-code', {
    method: 'post',
    payload: {
      mail: form.mail,
      code: form.code
    }
  })

  if (verified?.isError ?? true) {
    showNotice('Ошибка! Проверьте введенный код!', 'error')
    return
  }

  user.sessionToken = verified.sessionToken
  user.sessionExp = verified.sessionExp
  await getUser()
  user.showLogin = false
  showNotice('Успех!', 'success')

  // todo: ссылка на /user/profile?

}

// const onLogin = async () => {
//   isVerifyMail.value = true
//   try {
//     // todo data verification
//     const response = await myFetch('/api/auth/login', { method: 'post', payload: inputMail })
//     user.sessionToken = response.sessionToken
//     user.sessionExp = response.sessionExp

//   } catch (e) {
//     let notice
//     switch (e.statusCode) {
//       case 400:
//         notice = 'Заполните почту и пароль!'
//         break
//       case 401:
//         notice = 'Ошибка! Проверьте введенные почту и пароль!'
//         break
//       default:
//         notice = 'Ошибка авторизации!'
//     }
//     showNotice(notice, 'error')
//     return
//   }
//   await getUser()

//   onClose()

// }

const onGoogle = () => {
  showLoader()

  const googleUrl = getGoogleOAuthURL()
  // const googleUrl = '/test/catalog/shtangentsirkuli'
  const params = `status=no,location=no,toolbar=no,menubar=no,width=500,height=500,left=200,top=0`
  const oauthWin = window.open(googleUrl, 'oauth', params)
  const timer = setInterval(async () => {
    if (oauthWin.closed) {
      clearInterval(timer)
      if (user.isAuth) {
        // для экзотических случаев, когда логинится уже залогиненный юзер (что возможно),
        // сначала удалим sessionToken, чтобы получить юзера по refreshToken
        delete user.sessionToken
      }
      await getUser()
      hideLoader()
      if (user.isAuth) onClose()
    }
  }, 1000)
}
const getGoogleOAuthURL = () => {

  try {

    const config = useRuntimeConfig()
    const fullBaseUrl = window.location.origin + config.app.baseURL
    const googleRootUrl = 'https://accounts.google.com/o/oauth2/v2/auth'

    const options = {
      redirect_uri: fullBaseUrl + 'api/auth/oauth/google',
      client_id: config.GOOGLE_CLIENT_ID,
      access_type: 'offline',
      response_type: 'code',
      prompt: 'consent',
      scope: [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile'
      ].join(' ')

    }
    const qs = new URLSearchParams(options)

    return `${googleRootUrl}?${qs.toString()}`

  } catch (e) {
    console.error(e)
  }
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
               overflow-auto flex flex-col justify-start">
        <div class="login">
          <!--          header-->
          <div class="flex bg-emerald-200">
            <h1>Login</h1>
            <button @click="onTest" class="m-2 px-2 bg-cyan-500 rounded">Test</button>
            <button @click="onClose" class="m-2 px-2 bg-cyan-500 rounded">Close</button>
          </div>
          <!-- mailScreen -->
          <template v-if="!form.verifyScreen">
            <div>
              <span>Введите почту:</span>
              <input v-model="form.mail" type="email" class="mx-2"/>
              <button @click="sendCode" class="m-2 p-2 bg-cyan-500 rounded">Получить код</button>
            </div>
            <div>
              <span>Или</span>
              <button @click="onGoogle" class="m-2 p-2 bg-cyan-500 rounded">Войти через google</button>
            </div>
          </template>
          <!-- verifyScreen -->
          <template v-else>
            <div>На почту {{ form.mail }} было отправлено письмо, содержащее код для входа на сайт...</div>
            <div>
              <button @click='form.verifyScreen = false' class="m-2 p-2 bg-cyan-500 rounded">Назад</button>
              <input v-model="form.code" type="number" class="mx-2"/>
              <button @click='verifyCode' class="m-2 p-2 bg-cyan-500 rounded">OK</button>
            </div>

          </template>
        </div>
      </div>
    </HelperModalWrapper>
  </Transition>
</template>
