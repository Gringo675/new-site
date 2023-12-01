<script setup>
//
const props = defineProps({
  mail: String,
})

const user = useUser().value
const showCodeInput = ref(false)
const inputData = reactive({
  code: '',
  codeValid: false,
})
let serverHashHex = ''

const sendCode = async () => {
  //
  const response = await myFetch('/api/user/verifyNewMail', {
    method: 'post',
    payload: { mail: props.mail },
  })

  if (typeof response === 'string' && response.length === 64) {
    serverHashHex = response
    showCodeInput.value = true
  } else {
    const errorMessage = response.error ? response.message : 'Ошибка при обновлении почты!'
    showNotice({ title: 'Ошибка!', description: errorMessage, type: 'error' })
  }
}

watch(
  () => inputData.codeValid,
  value => {
    if (value) checkCode()
  }
)

const checkCode = async () => {
  const utf8 = new TextEncoder().encode(inputData.code)
  const hashBuffer = await crypto.subtle.digest('SHA-256', utf8)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map(bytes => bytes.toString(16).padStart(2, '0')).join('')

  if (hashHex === serverHashHex) {
    const isChangesSaved = await myFetch('/api/user/changeUser', {
      method: 'post',
      payload: [{ field: 'mail', value: props.mail }],
    })
    if (isChangesSaved) {
      user.mail = props.mail
      showNotice({ title: 'Почта успешно изменена!', type: 'success' })
    } else showNotice({ title: 'Ошибка при изменении почты!', type: 'error' })
  } else {
    inputData.codeValid = null
    showNotice({ title: 'Неверный код!', type: 'error' })
  }
}
</script>

<template>
  <div class="m-2 p-2 border border-yellow-300 rounded-md w-[350px]">
    <div
      v-if="!showCodeInput"
      class="flex flex-col"
    >
      <div>Необходимо подтвердить новую почту.</div>
      <div class="">
        <button
          class="button"
          @click="$emit('cancel')"
        >
          Отмена
        </button>
        <button
          class="button"
          @click="sendCode"
        >
          Подтвердить
        </button>
      </div>
    </div>
    <div
      v-else
      class="flex flex-col"
    >
      <div class="">
        На новый адрес было отправлено письмо, содержащее проверочный код. Пожалуйста проверьте почтовый ящик и введите
        код в данное поле.
      </div>
      <div>
        <input
          v-mask.code="inputData.code"
          @maskData="inputData.code = $event.detail.value"
          @maskComplete="inputData.codeValid = $event.detail.value"
          type="text"
          maxlength="5"
          v-focus
          class="mx-2 text-4xl w-28 border-2"
          :class="{
            'border-green-500': inputData.codeValid,
            'border-red-500': inputData.codeValid === null,
          }"
        />
        <button
          class="button"
          @click="$emit('cancel')"
        >
          Отмена
        </button>
      </div>
    </div>
  </div>
</template>
