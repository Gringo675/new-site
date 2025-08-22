<script setup>
//
// const isServer = import.meta.server // This will be true if the code is running on the server side
// console.log(`isServer: ${JSON.stringify(isServer, null, 2)}`)

const aaa = import.meta.server ? await $fetch('/api/apiTest') : 111
cv('just text from vue')
</script>

<template>
  <div>aaa: {{ aaa }}</div>
</template>
