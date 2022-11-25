<script setup>

// console.log(`before error: ${JSON.stringify(error, null, 2)}`)
// showError({statusCode: 511, statusMessage: `Network Authentication Required!`})
// throw createError({statusCode: 511, statusMessage: `Network Authentication Required!`})
// console.log(`step2`)
// console.log(`after error: ${JSON.stringify(error, null, 2)}`)
// const data = 111
// throw createError({statusCode: 512, statusMessage: `Network Authentication Required!`})

import dataFetch from "~/composables/common/dataFetch"
// import myFetch from "~/composables/common/myFetch"


const url = '/api/apiTest'

const {data, pending} = await dataFetch(url, {lazy: true})

console.log(`step2`)
const aaa = JSON.stringify(data)

</script>

<template>
  <div class="">
    data: {{data}}
    pending: {{pending}}
  </div>
</template>

<style>

</style>