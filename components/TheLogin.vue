<script setup>
//
const user = useUser().value
const form = ref()

const showVerifyScreen = ref(false)
const formState = reactive({
  mail: '',
  code: [],
})
const fieldErrors = {
  mail: '',
  code: '',
}

watch(
  () => formState.mail,
  val => {
    fieldErrors.mail = !validateMail(val) ? 'Введите корректный почтовый адрес!' : ''
  },
  { immediate: true },
)
const validate = () => {
  return Object.entries(fieldErrors)
    .filter(([_, message]) => message)
    .map(([name, message]) => ({ name, message }))
}

const sendCode = async () => {
  showVerifyScreen.value = true
  return
  if (fieldErrors.mail) {
    showNotice({ title: 'Неправильный адрес!', description: fieldErrors.mail, type: 'error' })
    return
  }

  const isCodeSend = await myFetch('/api/auth/login/createCode', {
    method: 'post',
    payload: { mail: formState.mail },
  })

  if (isCodeSend) {
    showVerifyScreen.value = true
  }
}

const onCodeChange = event => {
  console.log(`event: ${JSON.stringify(event.complete, null, 2)}`)
  // if (event.detail.completed) verifyCode(event.detail.masked)
  // else fieldErrors.code = ''
}

const verifyCode = async () => {
  console.log('code', formState.code.join(''))
  fieldErrors.code = 'Неверный код!'
  return

  const verified = await myFetch('/api/auth/login/verifyCode', {
    method: 'post',
    payload: {
      mail: formState.mail,
      code: formState.code.join(''),
    },
  })

  if (verified) {
    await getUser()
    user.showLogin = false
    showNotice({
      title: 'Авторизация пройдена!',
      description: user.name.length ? `${user.name}, с возвращением!` : '',
      type: 'success',
    })
    closeLogin()
  } else {
    fieldErrors.code = 'Неверный код!'
  }
}

const backOnMailScreen = () => {
  showVerifyScreen.value = false
  formState.code = []
  fieldErrors.mail = ''
  fieldErrors.code = ''
  form.value.clear() // очищаем ошибки
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
</script>

<template>
  <UModal
    title="Вход/регистрация"
    description=""
    :dismissible="false"
    :ui="{
      content: 'max-w-xl',
      header: 'min-h-auto',
    }"
  >
    <template #body>
      <UForm
        ref="form"
        :validate="validate"
        :state="formState"
        class="mb-4 space-y-4"
      >
        <template v-if="!showVerifyScreen">
          <div class="mb-4 text-sm text-neutral-500">
            Введите почтовый адрес, привязанный к аккаунту. Если у Вас еще нет действующего аккаунта, введите почтовый
            адрес, на который он будет зарегистрирован.
          </div>
          <div class="flex flex-wrap items-start justify-evenly gap-x-4">
            <UFormField
              name="mail"
              label="Ваша почта"
              class=""
            >
              <UInput
                v-model="formState.mail"
                autofocus
                placeholder="example@mail.ru"
                class="w-3xs"
              />
            </UFormField>
            <div class="flex grow justify-center pt-6">
              <UButton
                label="Получить код авторизации"
                variant="subtle"
                color="neutral"
                @click="sendCode"
              />
            </div>
          </div>
          <div class="text-sm">Данный адрес не будет использоваться для рассылок или передаваться третьим лицам.</div>
          <USeparator label="Или" />
          <div class="mx-auto w-3xs space-y-4">
            <UButton
              label="Войти через google"
              icon="i-simple-icons-github"
              block
              @click="runOAuth('google')"
            />
            <UButton
              label="Войти через vk"
              icon="i-simple-icons-github"
              block
              @click="runOAuth('vk')"
            />
            <UButton
              label="Войти через mail.ru"
              icon="i-simple-icons-github"
              block
              @click="runOAuth('mailru')"
            />
            <UButton
              label="Login with GitHub"
              icon="i-simple-icons-github"
              block
            />
          </div>
        </template>
        <template v-else>
          <div>
            На почту <u>{{ formState.mail }}</u> был отправлен код авторизации. Введите его в данное поле.
          </div>
          <div class="flex items-start justify-between gap-x-4">
            <UFormField name="code">
              <UPinInput
                v-model="formState.code"
                type="number"
                :length="5"
                @change="onCodeChange"
              />
              <!-- <UInput
                v-model="formState.code"
                autofocus
                v-maska
                data-maska="#####"
                @maska="onMaska"
                placeholder="00000"
                input-class="tracking-widest"
                class="w-20"
              /> -->
            </UFormField>
            <UButton
              label="Назад"
              variant="outline"
              color="secondary"
              @click="backOnMailScreen"
            />
          </div>
        </template>
      </UForm>
    </template>
  </UModal>
</template>
