<script setup>
// weak protection admin resources
const user = useUser().value
if (!user.auth) throw createError({ statusCode: 401, statusMessage: `Authentication Required!` })
if (!user.admin) throw createError({ statusCode: 403, statusMessage: `Forbidden!` })
</script>

<template>
  <slot v-if="user.admin" />
</template>
