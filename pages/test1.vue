<script setup>
//
const TheUserProfileData = reactive({
  isUserDataChanged: false,
  isUserDataValid: false,
  saveUserData: () => {},
})
</script>

<template>
  <TheUserProfile
    @setIsUserDataChanged="value => (TheUserProfileData.isUserDataChanged = value)"
    @setIsUserDataValid="value => (TheUserProfileData.isUserDataValid = value)"
    @setSaveUserData="value => (TheUserProfileData.saveUserData = value)"
  />
  <div>{{ TheUserProfileData }}</div>
</template>
