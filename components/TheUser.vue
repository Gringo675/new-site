<script setup>
//
// await new Promise(r => setTimeout(r, 3000))

const user = useUser().value

onMounted(async () => {
  window.addEventListener('storage', event => {
    if (event.storageArea !== localStorage || event.key !== 'user-event') return
    if (event.newValue === '0') logoutUser()
    else if (event.newValue === '1') {
      user.showLogin = false
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
const handleLogin = () => {
  user.showLogin = true
}

const handleLogout = async () => {
  logoutUser()
}
</script>

<template>
  <div class="relative max-w-40">
    <UButton
      v-if="!user.auth"
      icon="i-heroicons-user"
      size="md"
      truncate
      :ui="{
        rounded: 'rounded-full',
        // truncate: '111 text-left break-keep line-clamp-2',
      }"
      @click="handleLogin"
      label="Войти"
    />

    <UButton
      v-else
      icon="i-heroicons-user"
      size="md"
      truncate
      :ui="{ rounded: 'rounded-full' }"
      @click="handleShowMenuClick"
      :label="user.name"
    />
    <Transition name="transition-below">
      <div
        v-if="menuState.show"
        class="absolute right-0 z-20 mt-2 flex w-28 flex-col items-end gap-y-2 rounded-md border border-green-600 bg-slate-200 p-4 shadow-xl hover:*:underline"
      >
        <NuxtLink to="/user/profile">Профиль</NuxtLink>
        <NuxtLink to="/user/orders">Заказы</NuxtLink>
        <NuxtLink
          to="/"
          @click="handleLogout"
          >Выход</NuxtLink
        >
      </div>
    </Transition>
  </div>
  <!-- <div class="m-2 bg-gray-300 border-2 border-slate-300 rounded-md cursor-pointer relative">
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
      <Transition name="transition-below">
        <div
          v-show="menuState.show"
          class="absolute mt-2 p-2 bg-red-500 flex flex-col items-end z-10"
        >
          <NuxtLink to="/user/profile">Профиль</NuxtLink>
          <NuxtLink to="/user/orders">Заказы</NuxtLink>
          <a @click="handleLogout">Выход</a>
        </div>
      </Transition>
    </div>
  </div> -->
</template>
