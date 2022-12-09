<script setup>
console.log(`from serverOnly`)

const isSiteClosed = process.env.IS_SITE_CLOSED === '1'

if (isSiteClosed) {
  console.log(`site closed`)
  throw createError({statusCode: 423, statusMessage: `Locked.`})
}

</script>

<template>
  <div class="TheTest2.client">
    serverOnly
  </div>
</template>

<style>

</style>