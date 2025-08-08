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
  clearError({ redirect: props.error.data?.path ?? '/' })
}

const toMainPage = () => {
  clearError({ redirect: '/' })
}

// Error messages based on status code
const errorMessages = {
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
  423: {
    title: 'Сервер недоступен',
    description: 'Ведутся технические работы. Пожалуйста, попробуйте позже.',
    icon: 'i-lucide-wrench',
  },
}

const currentError = computed(() => {
  return (
    errorMessages[props.error.statusCode] || {
      title: 'Произошла ошибка',
      description: 'Возникла непредвиденная ошибка. Пожалуйста, попробуйте позже.',
      icon: 'i-lucide-alert-triangle',
    }
  )
})
</script>

<template>
  <HelperApp>
    <div
      class="mx-auto my-6 flex w-full max-w-xl flex-col items-center justify-center gap-6 rounded-xl bg-gray-200 p-6 shadow-lg md:my-12">
      <UIcon
        :name="currentError.icon"
        class="text-error size-20" />
      <div class="text-error text-4xl font-bold">{{ error.statusCode }}</div>
      <h2 class="mb-2 text-center text-2xl font-bold">{{ currentError.title }}</h2>

      <p class="mb-4 text-center">
        {{ currentError.description }}
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
