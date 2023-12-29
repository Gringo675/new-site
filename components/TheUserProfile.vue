<script setup>
/**
 * Компонент показа и сохранения изменений в данных пользователя.
 * Используется на странице данных пользователя (/user/profile), в корзине (/user/cart) и на форме обратной связи.
 * Нужные данные эмитятся в родитель.
 * Если пользователь авторизован, все изменения в данных записываются в базу.
 * Если нет, введенные данные просто записываются в переменную user.
 */

await getUser({ hidden: true })
const user = useUser().value

const newUser = reactive({
  name: {
    val: user.name,
    changed: computed(() => newUser.name.val !== user.name),
    valid: computed(() => newUser.name.val.length > 0),
  },
  mail: {
    val: user.mail,
    changed: computed(() => newUser.mail.val !== user.mail),
    valid: computed(() => validateMail(newUser.mail.val)),
  },
  org: {
    val: user.org,
    changed: computed(() => newUser.org.val !== user.org),
    valid: computed(() => newUser.org.val.length < 500),
  },
  inn: {
    val: user.inn,
    changed: computed(() => newUser.inn.val !== user.inn),
    valid: computed(() => [0, 10, 12].includes(newUser.inn.val.length)),
  },
  address: {
    val: user.address,
    changed: computed(() => newUser.address.val !== user.address),
    valid: computed(() => newUser.address.val.length < 1000),
  },
  phone: {
    val: user.phone,
    changed: computed(() => newUser.phone.val !== user.phone),
    valid: computed(() => [0, 13].includes(newUser.phone.val.length)),
  },
})

const isUserDataChanged = computed(
  () =>
    newUser.name.changed ||
    newUser.mail.changed ||
    newUser.org.changed ||
    newUser.inn.changed ||
    newUser.address.changed ||
    newUser.phone.changed
)
const isUserDataValid = computed(
  () =>
    ((user.auth && !newUser.mail.changed) || !user.auth) &&
    newUser.name.valid &&
    newUser.mail.valid &&
    newUser.org.valid &&
    newUser.inn.valid &&
    newUser.address.valid &&
    newUser.phone.valid
)

const validate = newUser => {
  const errors = []
  if (!newUser.name.valid) errors.push({ path: 'name', message: 'Введите имя!' })
  if (!newUser.mail.valid) errors.push({ path: 'mail', message: 'Введите корректный почтовый адрес!' })
  if (!newUser.org.valid) errors.push({ path: 'org', message: 'Слишком длинное наименование!' })
  if (!newUser.inn.valid) errors.push({ path: 'inn', message: 'Введите корректный ИНН организации!' })
  if (!newUser.address.valid) errors.push({ path: 'address', message: 'Слишком длинный адрес!' })
  if (!newUser.phone.valid) errors.push({ path: 'phone', message: 'Введите корректный номер телефона!' })

  return errors
}

const saveUserData = async () => {
  try {
    // для авторизированных пользователей сохраняем изменения на сервере
    if (user.auth) {
      const dataKeys = ['name', 'mail', 'org', 'inn', 'address', 'phone'] // без почты, для нее отдельный компонент
      const changedUserData = dataKeys
        .filter(key => newUser[key].changed)
        .map(key => {
          return { field: key, value: newUser[key].val }
        })
      const isChangesSaved = await myFetch('/api/user/changeUser', {
        method: 'post',
        payload: changedUserData,
      })
      if (!isChangesSaved) throw new Error()
      localStorage.setItem('user-event', Date.now().toString()) // для обновления всех открытых вкладок
    }

    // перезаписываем все данные в user
    for (const key in newUser) {
      user[key] = newUser[key].val
    }

    return true
  } catch (e) {
    showNotice({ title: 'Ошибка при сохранении данных пользователя!', type: 'error' })
  }
}

const emit = defineEmits(['setIsUserDataChanged', 'setIsUserDataValid', 'setSaveUserData'])
emit('setIsUserDataChanged', isUserDataChanged)
emit('setIsUserDataValid', isUserDataValid)
emit('setSaveUserData', saveUserData)

function onError(event) {
  const element = document.getElementById(event.errors[0].id)
  element?.focus()
  element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}
</script>

<template>
  <UForm
    :validate="validate"
    :state="newUser"
    id="up_form"
    @error="onError"
    class="space-y-4"
  >
    <UFormGroup
      label="Имя"
      name="name"
      required
      autofocus
    >
      <UInput v-model="newUser.name.val" />
    </UFormGroup>
    <UFormGroup
      label="Почта"
      name="mail"
      required
    >
      <UInput v-model="newUser.mail.val" />
      <MailVerifier
        v-if="user.auth && newUser.mail.changed && newUser.mail.valid"
        :mail="newUser.mail.val"
        @cancel="newUser.mail.val = user.mail"
      />
    </UFormGroup>
    <UFormGroup
      label="Организация"
      name="org"
    >
      <UInput v-model="newUser.org.val" />
    </UFormGroup>
    <UFormGroup
      label="ИНН"
      name="inn"
    >
      <UInput
        v-maska
        data-maska="############"
        v-model="newUser.inn.val"
      />
    </UFormGroup>
    <UFormGroup
      label="Адрес"
      name="address"
    >
      <UInput v-model="newUser.address.val" />
    </UFormGroup>
    <UFormGroup
      label="Телефон"
      name="phone"
    >
      <UInput
        v-maska
        data-maska="### ###-##-##"
        v-model="newUser.phone.val"
        type="tel"
        placeholder="000 000-00-00"
      />
    </UFormGroup>
  </UForm>
</template>
