<script setup>
throw createError({statusCode: 481, statusMessage: `Random error`})
console.log(`after error`)
const {pending, data, error} = useAsyncData('test', () => $fetch('/api/apiTest'))
console.log(`pending.value: ${JSON.stringify(pending.value, null, 2)}`)
</script>

<template>
  <h1>Test1</h1>
  <div>pending: {{pending}}</div>
  <div>data: {{data}}</div>
  <div>error: {{error}}</div>
</template>

