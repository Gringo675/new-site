<script setup>
import useUser from "~/composables/user/useUser"
const {value: user} = useUser()

const props = defineProps({
  error: Object,
  isGlobal: Boolean
})

const route = useRoute()

const error = props.error
console.log(`error: ${JSON.stringify(error, null, 2)}`)
error.statusCode = Number(error.statusCode)

const showLogin = () => {
  user.showLogin = true
  user.redirect = route.path
}
// if (error.statusCode === 401) showLogin()



const handleError = () => clearError({ redirect: '/' })

</script>

<template>
  <div>
    <div v-if="error.statusCode === 401">
      <h2>Для доступа к ресурсу необходима авторизация!</h2>
      <button class="m-2 p-2 bg-cyan-500" @click="showLogin">Войти</button>
      <button class="m-2 p-2 bg-cyan-500" @click="handleError">На главную</button>
    </div>
    <div v-else-if="error.statusCode === 403">
      <h2>Отказано в доступе!</h2>
      <button class="m-2 p-2 bg-cyan-500" @click="showLogin">Перелогиниться</button>
      <button class="m-2 p-2 bg-cyan-500" @click="handleError">На главную</button>
    </div>
    <div v-else-if="error.statusCode === 404">error 404</div>
    <div v-else>
      <h1>ERROR PAGE</h1>
      <h2>Code - {{ error.statusCode }}</h2>
      <h2>Message - {{ error.statusMessage }}</h2>
      <button class="m-2 p-2 bg-cyan-500" @click="handleError">Clear errors</button>
    </div>
    <ClientOnly>
      <TheLogin v-if="isGlobal"/>
    </ClientOnly>
  </div>
</template>