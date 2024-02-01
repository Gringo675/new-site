<script setup>
//
const user = useUser().value
const form = ref()

const state = reactive({
  mail: {
    val: '',
    valid: computed(() => validateMail(state.mail.val)),
  },
  code: {
    val: '',
    invalid: false,
  },
  verifyScreen: false,
})

const validate = state => {
  const errors = []
  if (state.mail.val.length && !state.mail.valid)
    errors.push({ path: 'mail', message: 'Введите корректный почтовый адрес!' })
  if (state.code.invalid) errors.push({ path: 'code', message: 'Неверный код!' })
  return errors
}

const sendCode = async () => {
  if (!state.mail.valid) {
    showNotice({ title: 'Неправильный адрес!', description: 'Введите корректный адрес.', type: 'error' })
    return
  }

  const isCodeSend = await myFetch('/api/auth/login/createCode', {
    method: 'post',
    payload: { mail: state.mail.val },
  })

  if (isCodeSend) {
    state.verifyScreen = true
    // getUserTimer.run()
  }
}

const onMaska = event => {
  if (event.detail.completed) verifyCode(event.detail.masked)
  else state.code.invalid = false
}

const verifyCode = async code => {
  const verified = await myFetch('/api/auth/login/verifyCode', {
    method: 'post',
    payload: {
      mail: state.mail.val,
      code,
    },
  })

  if (verified) {
    // getUserTimer.stop()
    await getUser()
    user.showLogin = false
    showNotice({
      title: 'Авторизация пройдена!',
      description: user.name.length ? `${user.name}, с возвращением!` : '',
      type: 'success',
    })
  } else {
    state.code.invalid = true
  }
}

const backOnMailScreen = () => {
  state.verifyScreen = false
  state.code.val = ''
  state.code.invalid = false
  form.value.setErrors([]) // очищаем ошибки
  // getUserTimer.stop()
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
      if (user.auth) user.showLogin = false
    }
  }, 1000)
}
</script>

<template>
  <UCard
    :ui="{
      header: {
        background: 'bg-secondary-200',
      },
    }"
  >
    <template #header>
      <div class="flex items-center justify-between gap-x-2">
        <h3 class="font-semibold">Вход/регистрация</h3>
        <UButton
          color="gray"
          variant="ghost"
          icon="i-heroicons-x-mark-20-solid"
          class="-my-1"
          @click="user.showLogin = false"
        />
      </div>
    </template>
    <UForm
      ref="form"
      :validate="validate"
      :state="state"
      class="space-y-4 mb-6"
    >
      <template v-if="!state.verifyScreen">
        <UFormGroup
          name="mail"
          help="Указанный адрес не будет использоваться для рассылок или передаваться третьим лицам."
        >
          <template #label>
            <div class="flex space-x-2">
              <span>Ваша почта</span>
              <UPopover
                mode="hover"
                :popper="{ placement: 'top' }"
              >
                <UIcon
                  name="i-heroicons-question-mark-circle"
                  class="bg-emerald-400 mx-1"
                />
                <template #panel>
                  <div class="p-4 max-w-sm">
                    Введите почтовый адрес, привязанный к вашему аккаунту. Если у вас еще нет действующего аккаунта,
                    введите почтовый адрес, на который вы хотите его зарегистрировать. На указанный ящик придет письмо с
                    кодом авторизации, который нужно будет указать на следующем шаге.
                  </div>
                </template>
              </UPopover>
            </div>
          </template>
          <UInput
            v-model="state.mail.val"
            autofocus
            placeholder="example@mail.ru"
          />
        </UFormGroup>
        <UButton
          label="Получить код авторизации"
          variant="outline"
          color="secondary"
          :disabled="!state.mail.valid"
          @click="sendCode"
        />
      </template>
      <template v-else>
        <div>
          На почту <u>{{ state.mail.val }}</u> был отправлен код авторизации. Введите его в данное поле.
        </div>
        <div class="flex gap-x-4 justify-between items-start">
          <UFormGroup
            name="code"
            eager-validation
          >
            <UInput
              v-model="state.code.val"
              autofocus
              v-maska
              data-maska="#####"
              @maska="onMaska"
              placeholder="00000"
              input-class="tracking-widest"
              class="w-20"
            />
          </UFormGroup>
          <UButton
            label="Назад"
            variant="outline"
            color="secondary"
            @click="backOnMailScreen"
          />
        </div>
      </template>
    </UForm>
    <div class="space-y-4">
      <UDivider
        label="ИЛИ"
        color="gray"
      />
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
  </UCard>
</template>
