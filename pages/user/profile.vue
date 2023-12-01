<script setup>
//
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
  <div v-if="user.auth">
    <TheUserProfile
      @setIsUserDataChanged="value => (TheUserProfileData.isUserDataChanged = value)"
      @setIsUserDataValid="value => (TheUserProfileData.isUserDataValid = value)"
      @setSaveUserData="value => (TheUserProfileData.saveUserData = value)"
    />
    <div>
      <button
        @click="buttonHandler"
        :disabled="!TheUserProfileData.isUserDataChanged || !TheUserProfileData.isUserDataValid"
        class="button"
      >
        Сохранить изменения
      </button>
    </div>
  </div>
  <div v-else>
    <span>Вы не вошли в аккаунт.</span>
    <button
      class="button"
      @click="user.showLogin = true"
    >
      Войти/зарегистрироваться
    </button>
  </div>
</template>
