<script setup>
//
const user = useUser().value

onMounted(async () => {
  setTimeout(() => {
    getUser({ hidden: true })
  }, 1000)
})

const showMenu = ref(false)

const handleShowMenuClick = event => {
  if (showMenu.value) return
  showMenu.value = true
  document.body.addEventListener('click', hideMenu, { once: true })
  event.stopPropagation()
}

const hideMenu = () => {
  showMenu.value = false
}

const handleLogin = () => {
  user.showLogin = true
}

const handleLogout = async () => {
  Object.keys(user).forEach(key => delete user[key])
  user.auth = false
  // удаляем cookie (refreshToken)
  await $fetch('/api/auth/logout')
  await navigateTo('/')
}
</script>

<template>
  <div class="m-2 bg-gray-300 border-2 border-slate-300 rounded-md cursor-pointer relative">
    <div
      v-if="!user.auth"
      @click="handleLogin"
      class="p-2"
    >
      Войти
    </div>
    <div
      v-else
      class=""
    >
      <div
        @click="handleShowMenuClick"
        class="p-2"
      >
        {{ user.name }}
      </div>
      <Transition name="transition-fade">
        <div
          v-show="showMenu"
          class="absolute p-2 bg-red-500 flex flex-col items-end z-10"
        >
          <NuxtLink to="/user/profile">Профиль</NuxtLink>
          <NuxtLink to="/user/orders">Заказы</NuxtLink>
          <a @click="handleLogout">Выход</a>
        </div>
      </Transition>
    </div>
  </div>
</template>
