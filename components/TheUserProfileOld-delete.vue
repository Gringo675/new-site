<script setup>
/**
 * Компонент показа и сохранения изменений в данных пользователя.
 * Используется на странице данных пользователя (/user/profile), в корзине (/user/cart) и на форме обратной связи.
 * Если пользователь авторизован, все изменения в данных записываются в базу.
 * Если нет, введенные данные просто записываются в переменную user.
 * После обработки изменений эмитит событие 'userDataHandled'.
 */

const emit = defineEmits(['userDataHandled'])

await getUser({ hidden: true })
const user = useUser().value

const newUser = reactive({
  name: {
    val: user.name,
    changed: computed(() => newUser.name.val !== user.name),
    valid: computed(() => !newUser.name.val || newUser.name.val.length > 2),
  },
  mail: {
    val: user.mail,
    changed: computed(() => newUser.mail.val !== user.mail),
    valid: computed(() => validateMail(newUser.mail.val)),
  },
  org: {
    val: user.org,
    changed: computed(() => newUser.org.val !== user.org),
    valid: computed(() => !newUser.org.val || newUser.org.val.length > 2),
  },
  inn: {
    val: user.inn,
    changed: computed(() => newUser.inn.val !== user.inn),
    complete: false,
    valid: computed(() => !newUser.inn.val || newUser.inn.complete),
  },
  address: {
    val: user.address,
    changed: computed(() => newUser.address.val !== user.address),
    valid: computed(() => !newUser.address.val || newUser.address.val.length > 2),
  },
  phone: {
    val: user.phone,
    changed: computed(() => newUser.phone.val !== user.phone),
    complete: false,
    valid: computed(() => !newUser.phone.val || newUser.phone.complete),
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

const actionHandler = async () => {
  try {
    if (!isUserDataValid) return
    if (isUserDataChanged) {
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
      }
      // перезаписываем все данные в user
      for (const key in newUser) {
        user[key] = newUser[key].val
      }
    }
    emit('userDataHandled')
  } catch (e) {
    showNotice('Ошибка при сохранении данных пользователя!', 'error')
  }
}
</script>

<template>
  <div>
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
      <span class="mr-2">Почта:&#10033;</span>
      <input
        type="text"
        v-model="newUser.mail.val"
        :class="{
          'border-green-400': newUser.mail.changed && newUser.mail.valid,
          'border-yellow-300': !newUser.mail.valid,
        }"
      />
    </div>
    <MailVerifier
      v-if="user.auth && newUser.mail.changed && newUser.mail.valid"
      :mail="newUser.mail.val"
      @cancel="newUser.mail.val = user.mail"
    />
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
    <div>
      <slot
        name="buttonsArea"
        :isUserDataChanged="isUserDataChanged"
        :isUserDataValid="isUserDataValid"
        :actionHandler="actionHandler"
      >
        <button
          @click="actionHandler"
          :disabled="!isUserDataValid"
          class="button"
        >
          OK
        </button>
      </slot>
    </div>
  </div>
</template>
