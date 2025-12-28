<script setup>
//
const userAgent = import.meta.client ? navigator.userAgent : useRequestHeader('user-agent')

console.log('User Agent:', userAgent)
</script>

<template>
  <div>Try page 1</div>
</template>
