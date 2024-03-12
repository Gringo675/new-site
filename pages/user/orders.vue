<script setup>
const user = useUser().value
</script>

<template>
  <div v-if="user.auth">Here will be orders.</div>
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
