<script setup>
// Компонент показа и сохранения изменений в даннымх пользователя.
// Используется на страницах / user / profile && /user/cart.
// После обработки (сохранения) изменений эмитит событие 'changesHandled'.
// Перед выводом компонента нужно удостовериться, что пользователь авторизован.

const props = defineProps({
  fromCart: Boolean,
})
const emit = defineEmits(['changesHandled'])

const user = useUser().value

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
const dataKeys = ['name', 'org', 'inn', 'address', 'phone'] // без почты, для нее отдельный компонент

const isButtonDisabled = computed(() => {
  if (newUser.mail.changed) return true
  let isSomethingChanged = false
  for (const key of dataKeys) {
    if (newUser[key].changed) {
      isSomethingChanged = true
      if (!newUser[key].valid) return true
    }
  }
  if (!props.fromCart && !isSomethingChanged) return true
  return false
})

const buttonHandler = async () => {
  const changedUserData = dataKeys
    .filter(key => newUser[key].changed && newUser[key].valid)
    .map(key => {
      return { field: key, value: newUser[key].val }
    })

  if (changedUserData.length) await changeUser(changedUserData, { hidden: props.fromCart })

  emit('changesHandled')
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
    <MailVerifier
      v-if="newUser.mail.changed && newUser.mail.valid"
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
      <button
        @click="buttonHandler"
        :disabled="isButtonDisabled"
        class="button"
      >
        {{ fromCart ? 'Отправить заказ' : 'Сохранить' }}
      </button>
    </div>
  </div>
</template>
