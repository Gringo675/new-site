<script setup>
const user = useUser().value

// во избежании некорректного поведения обновляем юзера
Object.keys(user).forEach(key => delete user[key])
user.auth = false
await getUser()

const newUser = reactive({
  name: {
    val: user.name,
    changed: computed(() => newUser.name.val !== user.name),
    valid: computed(() => newUser.name.val.length > 1),
  },
  mail: {
    val: user.mail,
    changed: computed(() => newUser.mail.val !== user.mail),
    valid: computed(() => validateMail(newUser.mail.val)),
    verified: false,
  },
  org: {
    val: user.org,
    changed: computed(() => newUser.org.val !== user.org),
    valid: computed(() => !newUser.org.val || newUser.org.val.length > 4),
  },
  inn: {
    val: user.inn,
    changed: computed(() => newUser.inn.val !== user.inn),
    complete: false,
    valid: computed(() => newUser.inn.complete || !newUser.inn.val),
  },
  address: {
    val: user.address,
    changed: computed(() => newUser.address.val !== user.address),
    valid: computed(() => !newUser.address.val || newUser.address.val.length > 4),
  },
  phone: {
    val: user.phone,
    changed: computed(() => newUser.phone.val !== user.phone),
    complete: false,
    valid: computed(() => newUser.phone.complete || !newUser.phone.val),
  },
})

const enableSaveButton = computed(() => {
  for (const key in newUser) {
    if (newUser[key].changed && newUser[key].valid) return true
  }
  return false
})

const saveData = async () => {
  const payload = {}
  for (const key in newUser) {
    if (newUser[key].changed && newUser[key].valid) payload[key] = newUser[key].val
  }

  if (payload.mail && !newUser.mail.verified) {
    await verifyNewMail()
    return
  }
  const response = await myFetch('/api/user/changeUser', {
    method: 'post',
    payload,
  })

  if (response) {
    showNotice('Данные успешно обновлены!', 'success')

    await getUser({ force: true }) // Обновляем данные на странице
    for (const key in newUser) {
      newUser[key].val = user[key]
    }
    newUser.mail.verified = false
  } else {
    showNotice('При обновлении данных произошла ошибка!', 'error')
  }
}

const newMailVerifier = reactive({
  show: false,
  serverHashHex: '',
  code: '',
  codeValid: false,
})
const verifyNewMail = async mail => {
  newMailVerifier.serverHashHex = await myFetch('/api/user/verifyNewMail', {
    method: 'post',
    payload: { mail: newUser.mail.val },
  })
  if (!newMailVerifier.serverHashHex) {
    showNotice('Ошибка при обновлении почты', 'error')
    return
  }
  newMailVerifier.show = true
  watch(
    () => newMailVerifier.codeValid,
    async value => {
      if (value) await checkCode()
    }
  )
}
const checkCode = async () => {
  const utf8 = new TextEncoder().encode(newMailVerifier.code)
  const hashBuffer = await crypto.subtle.digest('SHA-256', utf8)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map(bytes => bytes.toString(16).padStart(2, '0')).join('')

  if (hashHex === newMailVerifier.serverHashHex) {
    newUser.mail.verified = true
    closeNewMailVerifier()
    saveData()
  } else {
    newMailVerifier.codeValid = null
    showNotice('Неверный код!', 'error')
  }
}
const closeNewMailVerifier = () => {
  newMailVerifier.show = false
  newMailVerifier.serverHashHex = ''
  newMailVerifier.code = ''
  newMailVerifier.codeValid = false
}
</script>

<template>
  <div v-if="user.auth">
    <div class="m-2">
      <span class="mr-2">Имя:</span>
      <input
        type="text"
        v-model="newUser.name.val"
        :class="{
          'border-green-400': newUser.name.changed && newUser.name.valid,
          'border-yellow-300': newUser.name.changed && !newUser.name.valid,
        }"
      />
    </div>
    <div class="m-2">
      <span class="mr-2">Почта:</span>
      <input
        type="text"
        v-model="newUser.mail.val"
        :class="{
          'border-green-400': newUser.mail.changed && newUser.mail.valid,
          'border-yellow-300': newUser.mail.changed && !newUser.mail.valid,
        }"
      />
    </div>
    <div class="m-2">
      <span class="mr-2">Организация:</span>
      <input
        type="text"
        v-model="newUser.org.val"
        :class="{
          'border-green-400': newUser.org.changed && newUser.org.valid,
          'border-yellow-300': newUser.org.changed && !newUser.org.valid,
        }"
      />
    </div>
    <div class="m-2">
      <span class="mr-2">ИНН организации:</span>
      <input
        type="text"
        v-mask.inn="newUser.inn.val"
        @maskData="newUser.inn.val = $event.detail.value"
        @maskComplete="newUser.inn.complete = $event.detail.value"
        :class="{
          'border-green-400': newUser.inn.changed && newUser.inn.valid,
          'border-yellow-300': newUser.inn.changed && !newUser.inn.valid,
        }"
        placeholder="9999999999"
      />
    </div>
    <div class="m-2">
      <span class="mr-2">Адрес:</span>
      <input
        type="text"
        v-model="newUser.address.val"
        :class="{
          'border-green-400': newUser.address.changed && newUser.address.valid,
          'border-yellow-300': newUser.address.changed && !newUser.address.valid,
        }"
      />
    </div>
    <div class="m-2">
      <span class="mr-2">Телефон:</span>
      <span class="pr-1">+7</span>
      <input
        type="text"
        v-mask.phone="newUser.phone.val"
        @maskData="newUser.phone.val = $event.detail.value"
        @maskComplete="newUser.phone.complete = $event.detail.value"
        :class="{
          'border-green-400': newUser.phone.changed && newUser.phone.valid,
          'border-yellow-300': newUser.phone.changed && !newUser.phone.valid,
        }"
        placeholder="999 999-99-99"
      />
    </div>
    <button
      class="button"
      :disabled="!enableSaveButton"
      @click="saveData"
    >
      Сохранить
    </button>
  </div>
  <div v-else>
    <span>Вы не вошли в аккаунт.</span>
    <button
      class="button"
      @click="user.showLogin = true"
    >
      Войти
    </button>
  </div>
  <Transition name="transition-fade">
    <HelperModalWrapper v-if="newMailVerifier.show">
      <div
        class="modal-form w-[500px] max-w-[95%] max-h-[90vh] border border-amber-900 rounded-xl overflow-auto flex flex-col justify-start"
      >
        <div class="flex flex-row justify-between items-center bg-orange-300 p-2.5">
          <div class="max-w-full whitespace-nowrap overflow-hidden overflow-ellipsis size text-xl">
            Подтверждение новой почты
          </div>
        </div>
        <div class="p-5 overflow-auto bg-amber-100">
          <div class="">
            На адрес {{ newUser.mail.val }} было отправлено письмо, содержащее проверочный код. Пожалуйста проверьте
            почтовый ящик и введите код в данное поле.
          </div>
          <div>
            <input
              v-mask.code="newMailVerifier.code"
              @maskData="newMailVerifier.code = $event.detail.value"
              @maskComplete="newMailVerifier.codeValid = $event.detail.value"
              type="text"
              maxlength="5"
              v-focus
              class="mx-2 text-4xl w-28 border-2"
              :class="{
                'border-green-500': newMailVerifier.codeValid,
                'border-red-500': newMailVerifier.codeValid === null,
              }"
            />
          </div>
        </div>
        <div class="p-2.5 bg-orange-200 flex justify-end items-center">
          <button
            @click="closeNewMailVerifier"
            class="button px-2 py-1"
          >
            Отмена
          </button>
        </div>
      </div>
    </HelperModalWrapper>
  </Transition>
</template>
