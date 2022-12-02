<script setup>

const user = useUser()

const props = defineProps({
  error: Object,
  isGlobal: Boolean
})

const isGlobal = props.isGlobal
// let error = isGlobal ? props.error : props.error.value
const error = isGlobal ? ref(props.error) : props.error
error.value.statusCode = Number(error.value.statusCode)
// console.log(`error: ${JSON.stringify(error, null, 2)}`)
// console.log(`isGlobal: ${JSON.stringify(isGlobal, null, 2)}`)

console.error(error.value)

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
    <div v-if="error.statusCode === 401">
      <h2>Для доступа к ресурсу необходима авторизация!</h2>
      <button class="m-2 p-2 bg-cyan-500" @click="showLogin">Войти</button>
      <button class="m-2 p-2 bg-cyan-500" @click="toMainPage">На главную</button>
    </div>
    <div v-else-if="error.statusCode === 403">
      <h2>Отказано в доступе!</h2>
      <button class="m-2 p-2 bg-cyan-500" @click="showLogin">Перелогиниться</button>
      <button class="m-2 p-2 bg-cyan-500" @click="toMainPage">На главную</button>
    </div>
    <div v-else-if="error.statusCode === 404">
      <h2>Error 404</h2>
      <button class="m-2 p-2 bg-cyan-500" @click="toMainPage">На главную</button>
    </div>
    <div v-else>
      <h1>ERROR PAGE</h1>
      <h2>Code - {{ error.statusCode }}</h2>
      <h2>Message - {{ error.statusMessage }}</h2>
      <button class="m-2 p-2 bg-cyan-500" @click="toMainPage">На главную</button>
    </div>
    <ClientOnly>
      <TheLogin v-if="isGlobal"/>
    </ClientOnly>
  </div>
</template>