<script setup>
import useUser from "../composables/user/useUser";

// const someErrorLogger = () => {
//   console.log(`from someErrorLogger`)
// }
//
// const user = useUser()
//
// const handleError = (error) => {
//   user.value.isAdmin = true
//   console.log(`before error: ${JSON.stringify(error, null, 2)}`)
//   error.value = null
//   console.log(`after error: ${JSON.stringify(error, null, 2)}`)
// }

console.log(`!!!from test1!!!`)
const user = useUser()
if (!user.value.sessionToken) throw createError({ statusCode: 401, statusMessage: 'error 401'})
if (!user.value.isAdmin) throw createError({ statusCode: 403, statusMessage: 'error 403'})
</script>

<template>
  <div>
    test1
<!--    <NuxtErrorBoundary @error="someErrorLogger">-->
<!--      <TheTest/>-->
<!--      <template #error="{ error }">-->
<!--        You can display the error locally here.-->
<!--        <button class="button" @click="handleError(error)">-->
<!--          This will clear the error.-->
<!--        </button>-->
<!--      </template>-->
<!--    </NuxtErrorBoundary>-->
  </div>
</template>

<style>

</style>