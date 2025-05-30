<script setup>
// используется в корзине при оформлении заказа

const user = useUser().value
const userProfile = useTemplateRef('userProfileRef')
const fastOrder = ref(false)

const emit = defineEmits(['createOrder'])
const onCreateOrderClick = async () => {
  const isUserSaved = await userProfile.value.saveUserData()
  if (!isUserSaved) return
  emit('createOrder')
}
</script>

<template>
  <div class="mx-auto max-w-xl">
    <div
      class="my-4 rounded-lg border border-orange-400 bg-orange-50 p-4"
      v-if="!user.auth && !fastOrder"
    >
      <div class="text-sm">
        В настоящий момент Вы не авторизированы на сайте. Для сохранения истории заказов и упрощения процесса оформления
        заказа, рекомендуем войти в действующий или создать новый аккаунт.
      </div>
      <div class="mt-4 flex flex-wrap justify-evenly gap-4">
        <UButton
          label="Войти/зарегистрироваться"
          color="primary"
          @click="showLogin"
        />
        <UButton
          label="Продолжить без авторизации"
          @click="fastOrder = true"
        />
      </div>
    </div>
    <div
      class=""
      v-else
    >
      <TheUserProfile ref="userProfileRef" />
      <UButton
        label="Оформить заказ"
        color="tertiary"
        size="xl"
        class="mx-auto my-6 block px-10"
        @click="onCreateOrderClick"
      />
    </div>
  </div>
</template>
