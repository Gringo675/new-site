<script setup>
//
const openLoader = () => {
  showLoader()
  setTimeout(() => {
    showLoader()
  }, 2000)
  // setTimeout(() => {
  //   hideLoader();
  // }, 5000);
}

const sshowMessage = async () => {
  const proceed = await showMessage({
    title: 'Подтвердите удаление',
    description: 'Категория "Без имени" будет удалена. Продолжить?',
    isDialog: true,
  })

  console.log(`proceed: ${JSON.stringify(proceed, null, 2)}`)
}
const sshowLogin = async () => {
  await showLogin()
  console.log('login closed')
}
</script>

<template>
  <div class="bg-red-300 p-2">
    <div class="flex flex-wrap gap-4">
      <UButton
        label="To test1"
        color="neutral"
        variant="subtle"
        to="/test1"
      />
      <UButton
        label="To test2"
        color="neutral"
        variant="subtle"
        to="/test2"
      />

      <UButton
        label="To admin"
        color="neutral"
        variant="subtle"
        to="/admin"
      />
      <UButton
        label="Open message"
        color="neutral"
        variant="subtle"
        @click="sshowMessage"
      />
      <UButton
        label="Open loader"
        color="neutral"
        variant="subtle"
        @click="openLoader"
      />
      <UButton
        label="Open mobile menu"
        color="neutral"
        variant="subtle"
        @click="showMobileMenu"
        class="z-20"
      />
      <UButton
        label="Open cats menu"
        color="neutral"
        variant="subtle"
        @click="showCatsMenu"
        class="z-20"
      />
      <UButton
        label="Open feedback"
        color="neutral"
        variant="subtle"
        @click="showFeedback"
      />
      <UButton
        label="Show login"
        color="neutral"
        variant="subtle"
        @click="sshowLogin"
      />
    </div>
  </div>
</template>
