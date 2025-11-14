<script setup>
//
useTitle('Профиль пользователя')

const user = useUser()

const TheUserProfileRef = ref()

const buttonHandler = async () => {
  const isUserSaved = await TheUserProfileRef.value.saveUserData()
  if (isUserSaved) showNotice({ title: 'Данные успешно изменены!', type: 'success' })
}
</script>

<template>
  <h1 class="font-accent border-b border-gray-300 pb-2 text-3xl">Профиль</h1>

  <div
    v-if="user.auth"
    class="mx-auto flex max-w-md flex-col p-4">
    <TheUserProfile ref="TheUserProfileRef" />
    <UButton
      label="Сохранить изменения"
      variant="outline"
      color="secondary"
      @click="buttonHandler"
      class="m-4 self-center" />
  </div>
  <div
    v-else
    class="p-4">
    <UAlert
      icon="i-heroicons-exclamation-triangle"
      color="error"
      variant="outline"
      title="Вы не вошли в аккаунт!"
      description="Данная страница доступна только для зарегистрированных пользователей."
      :actions="[
        {
          variant: 'solid',
          color: 'primary',
          label: 'Войти/зарегистрироваться',
          onClick: showLogin,
        },
        { variant: 'outline', color: 'primary', label: 'На главную', to: '/' },
      ]"
      class="mx-auto max-w-lg" />
  </div>
</template>
