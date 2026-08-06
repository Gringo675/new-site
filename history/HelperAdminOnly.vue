<script setup>
// weak protection admin resources
const user = useUser()
if (!user.value.auth) await getUser({ hidden: true })
if (!user.value.auth) throw createError({ statusCode: 401, statusMessage: `Authentication Required!` })
if (!user.value.admin) throw createError({ statusCode: 403, statusMessage: `Forbidden!` })
</script>

<template>
  <slot v-if="user.admin" />
</template>
