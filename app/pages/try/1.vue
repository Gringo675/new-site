<script setup>
//
definePageMeta({
  layout: 'empty',
})
const test = 111
cv({ test })
</script>

<template>
  <h1>Some {{ test }}</h1>
</template>
