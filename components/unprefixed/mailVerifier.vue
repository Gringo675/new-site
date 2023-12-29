<script setup>
//
const props = defineProps({
  mail: String,
})

const user = useUser().value
const state = reactive({
  code: {
    val: '',
    invalid: false,
  },
  showCodeInput: false,
})
const validate = state => {
  const errors = []
  if (state.code.invalid) errors.push({ path: 'code', message: 'Неверный код!' })

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

const onMaska = event => {
  if (event.detail.completed) checkCode(event.detail.masked)
  else state.code.invalid = false
}

const checkCode = async code => {
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
    } else showNotice({ title: 'Ошибка при изменении почты!', type: 'error' })
  } else state.code.invalid = true
}
</script>

<template>
  <UAlert
    class="m-2 max-w-sm"
    title="Подтверждение почты"
    color="secondary"
    variant="outline"
  >
    <template #description>
      <div class="text-gray-900">
        <div
          v-if="!state.showCodeInput"
          class="flex flex-col"
        >
          <div class="py-2">Необходимо подтвердить новую почту.</div>
          <div class="flex gap-x-4 justify-end">
            <UButton
              label="Отмена"
              variant="outline"
              color="secondary"
              @click="$emit('cancel')"
            />
            <UButton
              label="Подтвердить"
              variant="outline"
              color="secondary"
              @click="sendCode"
            />
          </div>
        </div>
        <div
          v-else
          class="flex flex-col"
        >
          <div class="py-2 mb-2">
            На адрес {{ props.mail }} было отправлено письмо, содержащее код активации. Пожалуйста, введите его в данное
            поле.
          </div>

          <div class="flex gap-x-4 justify-between items-start">
            <UForm
              :state="state"
              :validate="validate"
            >
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
            </UForm>
            <UButton
              label="Отмена"
              variant="outline"
              color="secondary"
              @click="$emit('cancel')"
            />
          </div>
        </div>
      </div>
    </template>
  </UAlert>
</template>
