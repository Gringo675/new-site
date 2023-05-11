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
  serverHashHex = await myFetch('/api/user/verifyNewMail', {
    method: 'post',
    payload: { mail: props.mail },
  })

  if (!serverHashHex?.length) {
    showNotice('Ошибка при обновлении почты', 'error')
    return
  }
  showCodeInput.value = true
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
    changeUser({ mail: props.mail })
  } else {
    inputData.codeValid = null
    showNotice('Неверный код!', 'error')
  }
}
</script>

<template>
  <div class="m-2 p-2 border border-blue-300 rounded-md w-[350px]">
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
