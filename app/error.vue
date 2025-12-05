<script setup>
//
const props = defineProps({
  error: Object,
})
const router = useRouter()
const nuxtApp = useNuxtApp()
const user = useUser()

useOverlay().closeAll()
useTitle('Ошибка ' + (props.error.statusCode || ''))

props.error.url = props.error.url || router.currentRoute.value.fullPath // useRoute returns incorrect res.

if (!nuxtApp.isHydrating) setErrorToLog(props.error)
async function setErrorToLog(e) {
  try {
    const logError = await $fetch('/api/log/setError', {
      method: 'POST',
      body: {
        statusCode: e.statusCode || e.data?.statusCode || 0,
        statusMessage: e.statusMessage || e.data?.statusMessage || 'No message',
        url: e.url || 'No url',
        onServer: import.meta.server,
        stack: e.data?.stack || e.stack || 'No stack',
      },
    })
  } catch (logError) {
    console.error(`Can't write error to the log: ${logError.message}`)
  }
}

// console.error(props.error)
const onLogin = async () => {
  await showLogin()
  if (user.value.auth) refreshPage()
}

const refreshPage = () => {
  clearError({ redirect: props.error.url || '/' })
}

const toMainPage = () => {
  clearError({ redirect: '/' })
}

const displayError = {
  400: {
    title: 'Некорректная ссылка активации',
    description:
      'Похоже, вы перешли по некорректной или устаревшей ссылке из письма. Проверьте правильность ссылки или запросите новое письмо для активации аккаунта.',
    icon: 'i-lucide-link-2-off',
  },
  401: {
    title: 'Требуется авторизация',
    description: 'Для доступа к этой странице необходимо войти в систему.',
    icon: 'i-lucide-lock',
  },
  403: {
    title: 'Доступ запрещен',
    description: 'У вас нет необходимых прав для просмотра этой страницы.',
    icon: 'i-lucide-shield-x',
  },
  404: {
    title: 'Страница не найдена',
    description:
      'Запрашиваемая страница не существует или была перемещена. Воспользуйтесь нашим каталогом или поиском для выбора подходящей модели.',
    icon: 'i-lucide-file-question',
  },
}[props.error.statusCode] || {
  title: 'Произошла ошибка',
  description: 'Возникла непредвиденная ошибка. Пожалуйста, попробуйте позже.',
  icon: 'i-lucide-alert-triangle',
}
</script>

<template>
  <HelperApp>
    <div
      class="mx-auto my-6 flex w-full max-w-xl flex-col items-center justify-center gap-6 rounded-xl bg-gray-200 p-6 shadow-lg md:my-12">
      <UIcon
        :name="displayError.icon"
        class="text-error size-20" />
      <div class="text-error text-4xl font-bold">{{ error.statusCode }}</div>
      <h2 class="mb-2 text-center text-2xl font-bold">{{ displayError.title }}</h2>

      <p class="mb-4 text-center">
        {{ displayError.description }}
      </p>

      <div class="flex flex-wrap justify-center gap-4">
        <!-- Always show Login for 401 -->
        <UButton
          v-if="error.statusCode === 401"
          icon="i-lucide-log-in"
          color="secondary"
          label="Войти"
          @click="onLogin" />
        <!-- Admin Login for 403 -->
        <UButton
          v-else-if="error.statusCode === 403"
          icon="i-lucide-log-in"
          color="secondary"
          label="Вход для администраторов"
          @click="onLogin" />
        <!-- Refresh for unknown errors -->
        <UButton
          v-else-if="error.statusCode !== 404"
          icon="i-lucide-refresh-cw"
          color="secondary"
          label="Обновить страницу"
          @click="refreshPage" />
        <!-- Home button for all errors -->
        <UButton
          icon="i-lucide-home"
          label="На главную"
          @click="toMainPage" />
      </div>
    </div>
  </HelperApp>
</template>
