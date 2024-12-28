<script setup>
//
useSeoMeta({
  title: 'Профиль пользователя',
})

const user = useUser().value

const TheUserProfileData = reactive({
  isUserDataChanged: false,
  isUserDataValid: false,
  saveUserData: () => {},
})

const buttonHandler = async () => {
  const isUserSaved = await TheUserProfileData.saveUserData()
  // @ts-ignore
  if (isUserSaved) showNotice({ title: 'Данные успешно изменены!', type: 'success' })
}
</script>

<template>
  <div
    v-if="user.auth"
    class="p-4 max-w-md mx-auto flex flex-col"
  >
    <TheUserProfile
      @setIsUserDataChanged="value => (TheUserProfileData.isUserDataChanged = value)"
      @setIsUserDataValid="value => (TheUserProfileData.isUserDataValid = value)"
      @setSaveUserData="value => (TheUserProfileData.saveUserData = value)"
    />
    <UButton
      label="Сохранить изменения"
      variant="outline"
      color="secondary"
      :disabled="!TheUserProfileData.isUserDataChanged || !TheUserProfileData.isUserDataValid"
      @click="buttonHandler"
      class="self-center m-4"
    />
  </div>
  <div
    v-else
    class="p-4"
  >
    <UAlert
      icon="i-heroicons-exclamation-triangle"
      color="accent"
      variant="outline"
      title="Вы не вошли в аккаунт!"
      description="Данная страница доступна только для зарегистрированных пользователей."
      :actions="[
        { variant: 'solid', color: 'primary', label: 'Войти/зарегистрироваться', click: () => (user.showLogin = true) },
        { variant: 'outline', color: 'primary', label: 'На главную', click: () => navigateTo('/') },
      ]"
      class="max-w-lg mx-auto"
    />
  </div>
</template>
