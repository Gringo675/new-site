<script setup>

const user = useUser()

const props = defineProps({
  error: Object,
  isGlobal: Boolean
})

const isGlobal = props.isGlobal

const error = isGlobal ? ref(props.error) : props.error

error.value.code = Number(error.value.statusCode) // при некоторых ошибках не дает перезаписать statusCode, поэтому code

let unregisterAfterEachHook, unwatch

const router = useRouter()
if (!isGlobal) unregisterAfterEachHook = router.afterEach(() => error.value = null)

onUnmounted(() => {
  if (unregisterAfterEachHook) unregisterAfterEachHook()
  if (unwatch) unwatch()
})

const showLogin = () => {
  if (unwatch) unwatch() // чтобы не навесить больше одного
  user.value.showLogin = true
  // user.value.sessionToken = ''
  unwatch = watch(() => user.value.sessionToken, () => {
    // console.log(`from watch`)
    refreshPage()
    // navigateTo('/test1')
  })
}

const refreshPage = () => {
  const currentPath = (useRoute()).fullPath
  if (isGlobal) clearError({ redirect: currentPath })
  else navigateTo(currentPath) // автоматом сбросит ошибку
}

const toMainPage = () => {
  if (isGlobal) clearError({ redirect: '/' })
  else navigateTo('/')

}

// if (error.statusCode === 401) showLogin()


</script>

<template>
  <div>
    <div v-if="error.code === 401">
      <h2>Для доступа к ресурсу необходима авторизация!</h2>
      <button class="m-2 p-2 bg-cyan-500" @click="showLogin">Войти</button>
      <button class="m-2 p-2 bg-cyan-500" @click="toMainPage">На главную</button>
    </div>
    <div v-else-if="error.code === 403">
      <h2>Отказано в доступе!</h2>
      <button class="m-2 p-2 bg-cyan-500" @click="showLogin">Перелогиниться</button>
      <button class="m-2 p-2 bg-cyan-500" @click="toMainPage">На главную</button>
    </div>
    <div v-else-if="error.code === 404">
      <h2>Error 404</h2>
      <button class="m-2 p-2 bg-cyan-500" @click="toMainPage">На главную</button>
    </div>
    <div v-else-if="error.code === 423">
      <h2>На сервере ведутся технические работы. Доступ временно закрыт.</h2>
    </div>
    <div v-else>
      <h1>ERROR PAGE</h1>
      <h2>Code - {{ error.code }}</h2>
      <h2>Message - {{ error.statusMessage }}</h2>
      <button class="m-2 p-2 bg-cyan-500" @click="toMainPage">На главную</button>
    </div>
    <ClientOnly>
      <TheLogin v-if="isGlobal"/>
    </ClientOnly>
  </div>
</template>