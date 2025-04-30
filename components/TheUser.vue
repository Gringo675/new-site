<script setup>
//
// await new Promise(r => setTimeout(r, 3000))

const user = useUser().value

onMounted(async () => {
  window.addEventListener('storage', event => {
    if (event.storageArea !== localStorage || event.key !== 'user-event') return
    if (event.newValue === '0') logoutUser()
    else if (event.newValue === '1') {
      closeLogin()
      getUser()
    } else getUser({ force: true })
  })

  setTimeout(() => {
    getUser({ hidden: true })
  }, 1000)
})

const menuState = reactive({
  show: false,
})
const handleShowMenuClick = () => {
  if (menuState.show) return
  menuState.show = true
  setTimeout(() => window.addEventListener('click', () => (menuState.show = false), { once: true }), 10)
}
</script>

<template>
  <div class="relative max-w-40">
    <UButton
      v-if="!user.auth"
      icon="i-heroicons-user"
      size="md"
      truncate
      class="rounded-full"
      @click="showLogin"
      label="Войти"
    />

    <UButton
      v-else
      icon="i-heroicons-user"
      size="md"
      truncate
      class="rounded-full"
      @click="handleShowMenuClick"
      :label="user.name"
    />
    <Transition name="transition-below">
      <div
        v-if="menuState.show"
        class="absolute right-0 z-20 mt-2 flex w-28 flex-col items-end gap-y-2 rounded-md border border-green-600 bg-slate-200 p-4 shadow-xl"
      >
        <NuxtLink
          to="/user/profile"
          class="hover:underline"
          >Профиль</NuxtLink
        >
        <NuxtLink
          to="/user/orders"
          class="hover:underline"
          >Заказы</NuxtLink
        >
        <NuxtLink
          to="/"
          @click="logoutUser"
          class="hover:underline"
          >Выход</NuxtLink
        >
      </div>
    </Transition>
  </div>
</template>
