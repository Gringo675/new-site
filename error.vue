<script setup>
const props = defineProps({
  error: Object,
})
console.error(props.error)
const user = useUser()

useOverlay().closeAll()

const onLogin = async () => {
  await showLogin()
  if (user.value.auth) refreshPage()
}

const refreshPage = () => {
  clearError({ redirect: props.error.data.path })
}

const toMainPage = () => {
  clearError({ redirect: '/' })
}

const test = async () => {
  await clearError()
  await navigateTo('/test2')
  // showLoader()
  // throw new Error('error from error')
  // const bbb = aaa * 2
}
</script>

<template>
  <UApp>
    <NuxtLayout>
      <div>
        <div class="bg-red-400">
          <h1>Error ppppage</h1>
          <button
            class="m-2 bg-cyan-500 p-2"
            @click="test">
            Test
          </button>
          <div v-if="error.statusCode === 401">
            <h2>Для доступа к ресурсу необходима авторизация!</h2>
            <button
              class="m-2 bg-cyan-500 p-2"
              @click="onLogin">
              Войти
            </button>
            <button
              class="m-2 bg-cyan-500 p-2"
              @click="toMainPage">
              На главную
            </button>
          </div>
          <div v-else-if="error.statusCode === 403">
            <h2>Отказано в доступе!</h2>
            <button
              class="m-2 bg-cyan-500 p-2"
              @click="toMainPage">
              На главную
            </button>
          </div>
          <div v-else-if="error.statusCode === 404">
            <h2>Error 404</h2>
            <button
              class="m-2 bg-cyan-500 p-2"
              @click="toMainPage">
              На главную
            </button>
          </div>
          <div v-else-if="error.statusCode === 423">
            <h2>На сервере ведутся технические работы. Доступ временно закрыт.</h2>
            <button
              class="m-2 bg-cyan-500 p-2"
              @click="onLogin">
              Вход для администраторов (hidden)
            </button>
          </div>
          <div v-else>
            <h2 class="font-bold">ERROR PAGE</h2>
            <h2>Code - {{ error.statusCode }}</h2>
            <h2>Message - {{ error.statusMessage }}</h2>
            <div>
              Возможно, это временные неполадки с сетью. Попробуйте начать с главной или обновить текущую страницу. Если
              ошибка не исчезнет, пожалуйста, сообщите нам.
            </div>
            <UButton
              label="На главную"
              @click="toMainPage"
              class="m-2" />
            <UButton
              label="Обновить страницу"
              @click="refreshPage"
              class="m-2" />
          </div>
        </div>
      </div>
    </NuxtLayout>
  </UApp>
</template>
