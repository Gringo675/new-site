<script setup>
//
const user = useUser().value
</script>

<template>
  <TheUserProfile v-if="user.auth" />
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
