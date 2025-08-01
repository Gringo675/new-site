<script setup>
/**
 * Компонент показа и сохранения изменений в данных пользователя.
 * Используется на странице данных пользователя (/user/profile), в корзине (/user/cart) и на форме обратной связи.
 * Передает наружу функцию saveUserData, которую нужно запускать в родителе.
 * Если пользователь авторизован, все изменения в данных записываются в базу.
 * Если нет, введенные данные просто записываются в переменную user.
 */

const userProfileRef = useTemplateRef('userProfileRef')
defineExpose({ userProfileRef, saveUserData })

await getUser({ hidden: true })
const user = useUser()

const newUser = reactive({
  name: user.value.name,
  mail: user.value.mail,
  org: user.value.org,
  inn: user.value.inn,
  address: user.value.address,
  phone: user.value.phone,
})
const fieldErrors = {
  name: '',
  mail: '',
  org: '',
  inn: '',
  address: '',
  phone: '',
}
const shouldVerifyNewMail = ref(false)
const validateField = (field, value) => {
  switch (field) {
    case 'name':
      fieldErrors.name = value.length === 0 ? 'Введите имя!' : value.length > 100 ? 'Слишком длинное имя!' : ''
      break
    case 'mail':
      const isValid = validateMail(value)
      if (user.value.auth && isValid && value !== user.value.mail) shouldVerifyNewMail.value = true
      else shouldVerifyNewMail.value = false
      fieldErrors.mail = !isValid ? 'Введите корректный почтовый адрес!' : ''
      break
    case 'org':
      fieldErrors.org = value.length > 500 ? 'Слишком длинное наименование!' : ''
      break
    case 'inn':
      fieldErrors.inn = ![0, 10, 12].includes(value.length) ? 'Введите корректный ИНН организации!' : ''
      break
    case 'address':
      fieldErrors.address = value.length > 1000 ? 'Слишком длинный адрес!' : ''
      break
    case 'phone':
      fieldErrors.phone = ![0, 13].includes(value.length) ? 'Введите корректный номер телефона!' : ''
      break
  }
}
watch(
  () => newUser.name,
  val => validateField('name', val),
  { immediate: true },
)
watch(
  () => newUser.mail,
  val => validateField('mail', val),
  { immediate: true },
)
watch(
  () => newUser.org,
  val => validateField('org', val),
  { immediate: true },
)
watch(
  () => newUser.inn,
  val => validateField('inn', val),
  { immediate: true },
)
watch(
  () => newUser.address,
  val => validateField('address', val),
  { immediate: true },
)
watch(
  () => newUser.phone,
  val => validateField('phone', val),
  { immediate: true },
)

const validate = () => {
  return Object.entries(fieldErrors)
    .filter(([_, message]) => message)
    .map(([name, message]) => ({ name, message }))
}

function onError(event) {
  if (event?.errors?.[0]?.id) {
    const element = document.getElementById(event.errors[0].id)
    element?.focus()
    element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}

async function saveUserData() {
  const isValid = await userProfileRef.value.validate().catch(() => false) // если есть ошибки, выбрасывает ошибку
  if (!isValid) {
    userProfileRef.value.submit() // для запуска onError
    return false
  }

  try {
    // для авторизированных пользователей сохраняем изменения на сервере
    if (user.value.auth) {
      const dataKeys = ['name', 'mail', 'org', 'inn', 'address', 'phone'] // без почты, для нее отдельный компонент
      const changedUserData = dataKeys
        .filter(key => newUser[key].changed)
        .map(key => {
          return { field: key, value: newUser[key].val }
        })

      if (changedUserData.length) {
        const isChangesSaved = await myFetch('/api/user/changeUser', {
          method: 'post',
          payload: changedUserData,
        })
        if (!isChangesSaved) throw new Error()
        localStorage.setItem('user-event', Date.now().toString()) // для обновления всех открытых вкладок
      }
    }
    // перезаписываем все данные в user
    for (const key in newUser) {
      user[key] = newUser[key]
    }

    return true
  } catch (e) {
    showNotice({ title: 'Ошибка при сохранении данных пользователя!', type: 'error' })
    console.error(e)
    return false
  }
}
</script>

<template>
  <UForm
    ref="userProfileRef"
    :validate="validate"
    :state="newUser"
    @error="onError"
    class="space-y-4">
    <UFormField
      label="Имя"
      name="name"
      required
      autofocus>
      <UInput
        v-model="newUser.name"
        class="w-full" />
    </UFormField>
    <UFormField
      label="Почта"
      name="mail"
      required>
      <UInput
        type="email"
        v-model="newUser.mail"
        class="w-full" />
      <MailVerifier
        v-if="shouldVerifyNewMail"
        :mail="newUser.mail"
        @cancel="newUser.mail = user.mail"
        @verified="shouldVerifyNewMail = false" />
    </UFormField>
    <UFormField
      label="Организация"
      name="org">
      <UInput
        v-model="newUser.org"
        class="w-full" />
    </UFormField>
    <UFormField
      label="ИНН"
      name="inn">
      <UInput
        v-maska
        data-maska="############"
        v-model="newUser.inn"
        class="w-full" />
    </UFormField>
    <UFormField
      label="Адрес"
      name="address">
      <UInput
        v-model="newUser.address"
        class="w-full" />
    </UFormField>
    <UFormField
      label="Телефон"
      name="phone">
      <div class="flex items-center gap-2">
        <div class="text-base">+7</div>
        <UInput
          v-maska
          data-maska="### ###-##-##"
          v-model="newUser.phone"
          type="tel"
          placeholder="000 000-00-00"
          class="grow" />
      </div>
    </UFormField>
  </UForm>
</template>
