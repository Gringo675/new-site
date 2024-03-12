<script setup>
//
const router = useRouter()
const user = useUser().value
const message = useMessage()
const feedback = useFeedback()

hideLoader()
user.showLogin = false
message.active = false
feedback.isActive = false

onUnmounted(() => {
  user.showLogin = false
})

const props = defineProps({
  error: Object,
  isGlobal: Boolean,
})

const isGlobal = props.isGlobal
const error = isGlobal ? ref(props.error) : props.error
error.value.code = Number(error.value.statusCode) // при некоторых ошибках не дает перезаписать statusCode, поэтому code

console.log(`from TheError isGlobal: ${JSON.stringify(isGlobal, null, 2)}`)

// полноэкранная ошибка для закрытого сайта
if (error.value.code === 423 && !isGlobal) showError(error.value)

let unregisterAfterEachHook = () => {}
if (!isGlobal) unregisterAfterEachHook = router.afterEach(() => (error.value = null))
onUnmounted(() => unregisterAfterEachHook())

const showLogin = () => {
  user.showLogin = true
  const unwatch = watch(
    () => user.showLogin,
    () => {
      nextTick(() => unwatch()) // watch only once
      if (user.auth) refreshPage()
    }
  )
}

const refreshPage = () => {
  let currentPath = window.location.pathname
  let baseURL = useRuntimeConfig().app.baseURL
  if (baseURL !== '/') {
    // вырезаем baseURL
    if (baseURL[baseURL.length - 1] === '/') baseURL = baseURL.substring(0, baseURL.length - 1) // убираем слеш в конце
    try {
      const regexp = new RegExp(`${baseURL}(.+)`)
      currentPath = currentPath.match(regexp)[1]
    } catch (e) {
      currentPath = '/'
    }
  }
  if (isGlobal) clearError({ redirect: currentPath })
  else navigateTo(currentPath) // автоматом сбросит ошибку
}

const toMainPage = () => {
  if (isGlobal) clearError({ redirect: '/' })
  else navigateTo('/')
}

const test = () => {
  // showLoader()
  // throw new Error('error from error')
  const bbb = aaa * 2
}

const setToLog = async (error, isGlobal) => {
  // записываем ошибку в лог

  // const url = useRequestURL()
  // console.log(`url: ${JSON.stringify(url, null, 2)}`)
  // console.log(`pathname: ${JSON.stringify(url.pathname, null, 2)}`)
  const route = useRoute()
  console.log(`route: ${JSON.stringify(route.fullPath, null, 2)}`)
  console.log(`redirectedFrom: ${JSON.stringify(route.redirectedFrom, null, 2)}`)
  // try {
  //   await $fetch('/api/test')
  // } catch (e) {
  //   console.error(`Can't write error to the log: ${e.message}`)
  // }
}
// todo: add callOnce
setToLog()
</script>

<template>
  <div class="bg-red-400">
    <h1>Error component</h1>
    <button
      class="m-2 p-2 bg-cyan-500"
      @click="test"
    >
      Test
    </button>
    <div v-if="error.code === 401">
      <h2>Для доступа к ресурсу необходима авторизация!</h2>
      <button
        class="m-2 p-2 bg-cyan-500"
        @click="showLogin"
      >
        Войти
      </button>
      <button
        class="m-2 p-2 bg-cyan-500"
        @click="toMainPage"
      >
        На главную
      </button>
    </div>
    <div v-else-if="error.code === 403">
      <h2>Отказано в доступе!</h2>
      <button
        class="m-2 p-2 bg-cyan-500"
        @click="toMainPage"
      >
        На главную
      </button>
    </div>
    <div v-else-if="error.code === 404">
      <h2>Error 404</h2>
      <button
        class="m-2 p-2 bg-cyan-500"
        @click="toMainPage"
      >
        На главную
      </button>
    </div>
    <div v-else-if="error.code === 423">
      <h2>На сервере ведутся технические работы. Доступ временно закрыт.</h2>
      <button
        class="m-2 p-2 bg-cyan-500"
        @click="showLogin"
      >
        Вход для администраторов (hidden)
      </button>
    </div>
    <div v-else>
      <h2 class="font-bold">ERROR PAGE</h2>
      <h2>Code - {{ error.code }}</h2>
      <h2>Message - {{ error.statusMessage }}</h2>
      <button
        class="m-2 p-2 bg-cyan-500"
        @click="toMainPage"
      >
        На главную
      </button>
    </div>
  </div>
</template>
