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
  cv({ data: payload })
  await myFetch('/api/user/changeUser', {
    method: 'post',
    payload,
  })

  showNotice('Данные успешно обновлены!', 'success')

  await getUser({ force: true }) // Обновляем данные на странице
  for (const key in newUser) {
    newUser[key].val = user[key]
  }
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
</template>
