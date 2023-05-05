<script setup>
const user = useUser().value
user.showLogin = false
hideLoader() // на всякий случай

const props = defineProps({
  error: Object,
  isGlobal: Boolean,
})
// console.log(`props.error: ${JSON.stringify(props.error, null, 2)}`)
const isGlobal = props.isGlobal

const error = isGlobal ? ref(props.error) : props.error

error.value.code = Number(error.value.statusCode) // при некоторых ошибках не дает перезаписать statusCode, поэтому code

if (error.value.code === 423 && !isGlobal) {
  // полноэкранная ошибка для закрытого сайта
  showError(error.value)
}

let unregisterAfterEachHook, unwatch

const router = useRouter()
if (!isGlobal) unregisterAfterEachHook = router.afterEach(() => (error.value = null))

onUnmounted(() => {
  if (unregisterAfterEachHook) unregisterAfterEachHook()
  if (unwatch) unwatch()
})

const showLogin = async options => {
  if (unwatch) unwatch() // чтобы не навесить больше одного
  user.showLogin = true
  unwatch = watch(
    () => user.auth,
    () => {
      refreshPage()
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

// if (error.statusCode === 401) showLogin()

const test = () => {
  showLoader()
  // const routerPath = (useRoute()).fullPath
  // console.log(`routerPath: ${JSON.stringify(routerPath, null, 2)}`)
  //
  // let locationPath = window.location.pathname
  //
  // let baseURL = useRuntimeConfig().app.baseURL
  // if (baseURL !== '/') { // вырезаем baseURL
  //   if (baseURL[baseURL.length-1] === '/') baseURL = baseURL.substring(0, baseURL.length-1) // убираем слеш в конце
  //   try {
  //     const regexp = new RegExp(`${baseURL}(.+)`)
  //     locationPath = locationPath.match(regexp)[1]
  //   } catch (e) {
  //     locationPath = '/'
  //   }
  // }
  // console.log(`locationPath: ${JSON.stringify(locationPath, null, 2)}`)
  // navigateTo(locationPath)
}
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
