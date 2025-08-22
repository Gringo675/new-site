<script setup>
//
const emit = defineEmits(['close'])
const closeLogin = () => {
  emit('close')
}

const formRef = useTemplateRef('loginForm')
const user = useUser()

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
    fieldErrors.mail = val.length > 0 && !validateMail(val) ? 'Введите корректный почтовый адрес!' : ''
  },
  { immediate: true },
)
watch(
  () => formState.code,
  val => {
    const code = val.join('')
    if (code.length === 5) verifyCode(code)
    else fieldErrors.code = ''
  },
)

const validate = () => {
  return Object.entries(fieldErrors)
    .filter(([_, message]) => message)
    .map(([name, message]) => ({ name, message }))
}

const sendCode = async () => {
  if (fieldErrors.mail) return

  const isCodeSend = await myFetch('/api/auth/login/createCode', {
    method: 'post',
    payload: { mail: formState.mail },
  })

  if (isCodeSend) {
    showVerifyScreen.value = true
  }
}

const verifyCode = async code => {
  const verified = await myFetch('/api/auth/login/verifyCode', {
    method: 'post',
    payload: {
      mail: formState.mail,
      code,
    },
  })
  if (verified) {
    showNotice({
      title: 'Авторизация пройдена!',
      description: user.value.name.length ? `${user.value.name}, с возвращением!` : '',
      type: 'success',
    })
    await getUser()
    closeLogin()
  } else {
    fieldErrors.code = 'Неверный код!'
    formRef.value.validate().catch(() => false) // to trigger validation (show error)
  }
}

const backOnMailScreen = () => {
  showVerifyScreen.value = false
  formState.code = []
  fieldErrors.mail = ''
  fieldErrors.code = ''
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
      if (user.value.auth) closeLogin()
    }
  }, 1000)
}

const onSubmit = () => {
  // for Enter handling. UForm run this only if the form is valid.
  if (!showVerifyScreen.value) sendCode()
}
</script>

<template>
  <UModal
    title="Вход/регистрация"
    :dismissible="false"
    :ui="{
      content: 'max-w-xl',
      header: 'min-h-auto',
    }">
    <template #description></template>
    <template #body>
      <UForm
        :validate="validate"
        :state="formState"
        @submit="onSubmit"
        ref="loginForm"
        class="mb-4 space-y-4">
        <template v-if="!showVerifyScreen">
          <div class="mb-4 text-sm text-neutral-500">
            Введите почтовый адрес, привязанный к аккаунту. Если у Вас еще нет действующего аккаунта, введите почтовый
            адрес, на который он будет зарегистрирован.
          </div>
          <div class="flex flex-wrap items-start justify-evenly gap-x-4">
            <UFormField
              name="mail"
              label="Ваша почта"
              class="">
              <UInput
                type="email"
                v-model="formState.mail"
                autofocus
                placeholder="example@mail.ru"
                class="w-3xs" />
            </UFormField>
            <div class="flex grow justify-center pt-6">
              <UButton
                label="Получить код авторизации"
                variant="subtle"
                color="neutral"
                :disabled="!formState.mail"
                @click="sendCode" />
            </div>
          </div>
          <div class="text-sm">Данный адрес не будет использоваться для рассылок или передаваться третьим лицам.</div>
          <USeparator label="Или" />
          <div class="mx-auto w-3xs space-y-4">
            <UButton
              label="Войти через google"
              icon="i-simple-icons-github"
              block
              @click="runOAuth('google')" />
            <UButton
              label="Войти через vk"
              icon="i-simple-icons-github"
              block
              @click="runOAuth('vk')" />
            <UButton
              label="Войти через mail.ru"
              icon="i-simple-icons-github"
              block
              @click="runOAuth('mailru')" />
            <UButton
              label="Login with GitHub"
              icon="i-simple-icons-github"
              block />
          </div>
        </template>
        <template v-else>
          <div>
            На почту <span class="text-primary font-bold">{{ formState.mail }}</span> был отправлен код авторизации.
            Введите его в данное поле.
          </div>
          <div class="flex flex-wrap items-start justify-around gap-4">
            <UFormField name="code">
              <UPinInput
                v-model="formState.code"
                type="number"
                :length="5"
                autofocus
                otp />
            </UFormField>
            <UButton
              label="Назад"
              variant="subtle"
              color="neutral"
              @click="backOnMailScreen"
              class="px-8" />
          </div>
        </template>
      </UForm>
    </template>
  </UModal>
</template>
