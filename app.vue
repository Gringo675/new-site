<script setup>

// import useUser from "./composables/user/useUser";

onErrorCaptured((e) => {
  console.log(`from onErrorCaptured`)
  // console.log(`onErrorCaptured error: ${JSON.stringify(error, null, 2)}`)
  showError(e)
  return false
})

const someErrorLogger = () => {
  console.log(`NuxtErrorBoundary caught error`)
}

// const user = useUser()

// const handleError = (error) => {
//   user.value.isAdmin = true
//   clearError(error)
// }

// const clearError = (error) => {
//   console.log(`before error: ${JSON.stringify(error, null, 2)}`)
//   error.value = null
//   console.log(`after error: ${JSON.stringify(error, null, 2)}`)
// }

// const router = useRouter()
//
// router.beforeEach(() => {
//   console.log(`from beforeEach`)
// })

// const onTest = () => {
//   // const route = useRoute()
//   // console.log(`route: ${JSON.stringify(route, null, 2)}`)
// }

const sshowError = (error) => {
  console.log(`error: ${JSON.stringify(error, null, 2)}`)
}
</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtErrorBoundary @error="someErrorLogger">
        <NuxtPage/>
        <template #error="{ error }">
          <button class="m-2 p-2 bg-cyan-500" @click="sshowError(error)">showError</button>
          <TheError :error="error"/>
        </template>
      </NuxtErrorBoundary>
    </NuxtLayout>
    <ClientOnly>
      <TheMessage/>
      <TheLoader/>
      <TheNotice/>
      <TheLogin/>
    </ClientOnly>
  </div>
</template>
