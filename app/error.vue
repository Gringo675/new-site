<script setup>
//
const props = defineProps({
  error: Object,
})

const router = useRouter()
const nuxtApp = useNuxtApp()
const user = useUser()

const userAgent = import.meta.client ? navigator.userAgent : useRequestHeader('user-agent')
const richError = {
  statusCode: props.error.statusCode || props.error.code || props.error.data?.statusCode || props.error.data?.code || 0,
  statusMessage:
    props.error.statusMessage ||
    props.error.message ||
    props.error.data?.statusMessage ||
    props.error.data?.message ||
    'No message',
  url: props.error.url || router.currentRoute.value.fullPath, // useRoute returns incorrect res.
  onServer: import.meta.server,
  userAgent,
  isBot: useBotDetector(userAgent),
  stack: props.error.stack || props.error.data?.stack || 'No stack',
}

if (
  richError.isBot &&
  richError.statusCode === 500 &&
  richError.statusMessage.startsWith('Failed to fetch dynamically imported module')
) {
  // Ignore bot errors due to dynamic import failure
  richError.suppressed = true
  clearError({ redirect: richError.url })
  // maybe better use full refresh window.location.reload()
}

useOverlay().closeAll()
if (!richError.suppressed) useTitle('Ошибка ' + richError.statusCode)

if (!nuxtApp.isHydrating && !richError.isBot) setErrorToLog(richError)
async function setErrorToLog(richError) {
  try {
    await $fetch('/api/log/setError', {
      method: 'POST',
      body: richError,
    })
  } catch (e) {
    console.error(`Can't write error to the log: ${e.message}`)
  }
}

const onLogin = async () => {
  await showLogin()
  if (user.value.auth) refreshPage()
}

const refreshPage = () => {
  clearError({ redirect: richError.url || '/' })
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
}[richError.statusCode] || {
  title: 'Произошла ошибка',
  description: 'Возникла непредвиденная ошибка. Пожалуйста, попробуйте позже.',
  icon: 'i-lucide-alert-triangle',
}
</script>

<template>
  <HelperApp v-if="!richError.suppressed">
    <div
      class="mx-auto my-6 flex w-full max-w-xl flex-col items-center justify-center gap-6 rounded-xl bg-gray-200 p-6 shadow-lg md:my-12">
      <UIcon
        :name="displayError.icon"
        class="text-error size-20" />
      <div class="text-error text-4xl font-bold">{{ richError.statusCode }}</div>
      <h2 class="mb-2 text-center text-2xl font-bold">{{ displayError.title }}</h2>

      <p class="mb-4 text-center">
        {{ displayError.description }}
      </p>

      <div class="flex flex-wrap justify-center gap-4">
        <!-- Always show Login for 401 -->
        <UButton
          v-if="richError.statusCode === 401"
          icon="i-lucide-log-in"
          color="secondary"
          label="Войти"
          @click="onLogin" />
        <!-- Admin Login for 403 -->
        <UButton
          v-else-if="richError.statusCode === 403"
          icon="i-lucide-log-in"
          color="secondary"
          label="Вход для администраторов"
          @click="onLogin" />
        <!-- Refresh for unknown errors -->
        <UButton
          v-else-if="richError.statusCode !== 404"
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
