<script setup>

const user = useUser().value

try {
    const { mail, code } = useRoute().query
    // todo: check mail
    if (isNaN(code) || code.length !== 5) throw new Error('Incorrect code!')

    const result = await myFetch('/api/auth/login/verifyCode', {
        method: 'post',
        payload: {
            mail,
            code
        },
        silent: true
    })

    if (result?.sessionToken) {
        user.sessionToken = result.sessionToken
        user.sessionExp = result.sessionExp
    }

} catch (e) {
    console.error(e)
}

await getUser()

</script>

<template>
    <div v-if="user.isAuth">Активация успешно завершена!</div>
    <div v-else>Активация не удалась!</div>
</template>