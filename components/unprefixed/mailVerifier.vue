<script setup>
//
const props = defineProps({
  mail: String,
})
const emit = defineEmits(['cancel', 'verified'])

const user = useUser().value
const state = reactive({
  code: {
    val: [],
    invalid: false,
  },
  showCodeInput: false,
})
watch(
  () => state.code.val,
  val => {
    const code = val.join('')
    if (code.length === 5) verifyCode(code)
    else state.code.invalid = false
  },
)
const validate = state => {
  const errors = []
  if (state.code.invalid) errors.push({ name: 'code', message: 'Неверный код!' })
  return errors
}

let serverHashHex = ''

const sendCode = async () => {
  //
  const response = await myFetch('/api/user/verifyNewMail', {
    method: 'post',
    payload: { mail: props.mail },
  })

  if (typeof response === 'string' && response.length === 64) {
    serverHashHex = response
    state.showCodeInput = true
  } else {
    const errorMessage = response.error ? response.message : 'Ошибка при обновлении почты!'
    showNotice({ title: 'Ошибка!', description: errorMessage, type: 'error' })
  }
}

const verifyCode = async code => {
  const utf8 = new TextEncoder().encode(code)
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
      emit('verified')
    } else showNotice({ title: 'Ошибка при изменении почты!', type: 'error' })
  } else state.code.invalid = true
}
</script>

<template>
  <UAlert
    class="my-2"
    title="Подтверждение почты"
    icon="i-heroicons-exclamation-triangle"
    variant="outline"
  >
    <template #description>
      <div
        v-if="!state.showCodeInput"
        class="text-neutral-700"
      >
        <div class="py-2">Необходимо подтвердить новую почту.</div>
        <div class="flex justify-end gap-x-4">
          <UButton
            label="Отмена"
            variant="outline"
            color="neutral"
            @click="emit('cancel')"
          />
          <UButton
            label="Подтвердить"
            variant="subtle"
            color="neutral"
            @click="sendCode"
          />
        </div>
      </div>
      <div
        v-else
        class="text-neutral-700"
      >
        <div class="py-2">
          На адрес <span class="font-bold underline underline-offset-4">{{ props.mail }}</span> было отправлено письмо,
          содержащее код активации. Пожалуйста, введите его в данное поле.
        </div>
        <div class="flex flex-wrap items-start justify-around gap-4">
          <UForm
            :state="state"
            :validate="validate"
          >
            <UFormField name="code">
              <UPinInput
                v-model="state.code.val"
                type="number"
                :length="5"
                otp
              />
            </UFormField>
          </UForm>
          <UButton
            label="Отмена"
            variant="subtle"
            color="neutral"
            @click="emit('cancel')"
          />
        </div>
      </div>
    </template>
  </UAlert>
</template>
