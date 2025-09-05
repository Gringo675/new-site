<script setup>
// страница авторизации по ссылке в письме
useTitle('Активация аккаунта')

const user = useUser()
const route = useRoute()

const { mail, code } = route.query
if (!validateMail(mail) || isNaN(Number(code)) || String(code).length !== 5)
  throw createError({ statusCode: 400, statusMessage: `Некорректный формат почты или кода!` })

await myFetch('/api/auth/login/verifyCode', {
  method: 'post',
  payload: { mail, code },
  silent: true,
})
await getUser({ hidden: true })
if (!user.value.auth) throw createError({ statusCode: 400, statusMessage: `Активация не удалась!` })

onMounted(() => setTimeout(async () => await navigateTo('/'), 5000))
</script>

<template>
  <div class="flex min-h-[60vh] flex-col items-center justify-center">
    <div class="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 text-center shadow-lg">
      <div class="mb-4 flex justify-center">
        <UIcon
          name="i-heroicons-check-circle"
          class="text-primary h-16 w-16" />
      </div>
      <h2 class="text-primary mb-2 text-2xl font-bold">Активация успешно завершена!</h2>
      <p class="mb-4 text-slate-700">
        Добро пожаловать! Ваш аккаунт активирован.<br />Через 5 секунд вы будете перенаправлены на главную страницу.
      </p>
      <UButton
        color="primary"
        size="lg"
        to="/"
        >На главную</UButton
      >
    </div>
  </div>
</template>
