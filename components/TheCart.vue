<script setup>

const {value: user} = useUser()

onMounted(() => {
  setTimeout(async () => {
    getUser()
  }, 3000)
})

</script>

<template>
  <div class="">
    Hi{{(user.name ? ' ' + user.name : '')}}!
  </div>
</template>

<style>

</style>