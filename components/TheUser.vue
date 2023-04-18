<script setup>

const user = useUser().value
const showMenu = ref(false)

onMounted(() => {
    setTimeout(() => {
        refreshUser()
    }, 5000);
})

const handleLogin = () => {
    user.showLogin = true
}

const handleLogout = async () => {
    Object.keys(user).forEach(key => delete user[key])
    user.isAuth = false
    // удаляем cookie (refreshToken)
    await $fetch('/api/auth/logout')
    navigateTo('/')
}

const test = () => {
    console.log(`from test`)
}

</script>

<template>
    <div class="m-2 p-2 bg-gray-300 border-2 border-slate-300 rounded-md cursor-pointer ">
        <div v-if="!user.isAuth" @click="handleLogin" class="">
            Войти
        </div>
        <div v-else @click="showMenu = !showMenu" class="">
            <div>
                {{ user.name }}
            </div>
            <div v-show="showMenu" class="absolute m-2 p-2 bg-red-500 flex flex-col items-end">
                <NuxtLink to="/user/profile">Профиль</NuxtLink>
                <NuxtLink to="/user/orders">Заказы</NuxtLink>
                <a @click="handleLogout">Выход</a>
            </div>
        </div>
    </div>
</template>