<script setup>
async function hash(string) {
  const utf8 = new TextEncoder().encode(string)
  const hashBuffer = await crypto.subtle.digest('SHA-256', utf8)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map(bytes => bytes.toString(16).padStart(2, '0')).join('')
  return hashHex
}

const aaa = '12345'
const bbb = await hash(aaa)
</script>

<template>
  <h1>Test1</h1>
  <div>{{ bbb }}</div>
</template>
