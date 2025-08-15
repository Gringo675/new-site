<script setup>
useTitle('Мои заказы')

const user = useUser()
</script>

<template>
  <h1 class="font-accent border-b border-gray-300 pb-2 text-3xl">История заказов</h1>
  <HelperUserOrders v-if="user.auth" />
  <UAlert
    v-else
    icon="i-heroicons-exclamation-triangle"
    color="error"
    variant="outline"
    class="mx-auto my-8 max-w-lg">
    Вы не вошли в аккаунт!
    <template #description> Данная страница доступна только для зарегистрированных пользователей. </template>
    <template #actions>
      <UButton
        color="primary"
        variant="solid"
        @click="showLogin">
        Войти/зарегистрироваться
      </UButton>
      <UButton
        color="primary"
        variant="outline"
        @click="navigateTo('/')">
        На главную
      </UButton>
    </template>
  </UAlert>
</template>
