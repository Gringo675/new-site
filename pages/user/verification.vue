<script setup>
// страница авторизации по ссылке в письме
const user = useUser().value

try {
  const { mail, code } = useRoute().query

  if (!validateMail(mail)) throw new Error('Incorrect mail format!')
  if (isNaN(Number(code)) || code.length !== 5) throw new Error('Incorrect code format!')

  await myFetch('/api/auth/login/verifyCode', {
    method: 'post',
    payload: {
      mail,
      code,
    },
    silent: true,
  })
} catch (e) {
  console.error(e)
}

await getUser({ hidden: true })
</script>

<template>
  <div v-if="user.auth">Активация успешно завершена!</div>
  <div v-else>Активация не удалась!</div>
</template>
