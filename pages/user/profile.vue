<script setup>

const user = useUser().value

// во избежании некорректного поведения обновляем юзера
Object.keys(user).forEach(key => delete user[key])
user.isAuth = false
await getUser() 




</script>

<template>
  <div v-if="user.isAuth">
    <div class="m-2">
      <span class="mr-2">Имя:</span>
      <input type="text" v-model="user.name" readonly>
    </div>
    <div class="m-2">
      <span class="mr-2">Почта:</span>
      <input type="text" v-model="user.mail" readonly>
    </div>
    <div class="m-2">
      <span class="mr-2">Организация:</span>
      <input type="text" v-model="user.org" readonly>
    </div>
    <div class="m-2">
      <span class="mr-2">ИНН организации:</span>
      <input type="text" v-model="user.inn" readonly>
    </div>
    <div class="m-2">
      <span class="mr-2">Адрес:</span>
      <input type="text" v-model="user.address" readonly>
    </div>
    <div class="m-2">
      <span class="mr-2">Телефон:</span>
      <input type="text" v-model="user.phone" readonly>
    </div>
  </div>
  <div v-else>
    <span>Вы не вошли в аккаунт.</span>
    <button class="button" @click="user.showLogin = true">Войти</button>
  </div>
</template>