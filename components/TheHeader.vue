<script setup>

import {useNuxtApp} from "#app/nuxt.js";

const test = () => {
  const key = "/api/getCategory?alias=shtangentsirkuli"
  // let data = useNuxtData(url).data
  // console.log(`data: ${JSON.stringify(data, null, 2)}`)
  // let error = useNuxtData(url).error
  // console.log(`error: ${JSON.stringify(error, null, 2)}`)
  const nuxt = useNuxtApp();
  const errors = nuxt.payload._errors
  console.log(`errors: ${JSON.stringify(errors, null, 2)}`)

}

const createDialog = () => {
  showMessage('My very very large title', '<p>paragraph with <i>italic</i> word</p>', 'success', () => {
    localFn(localVar)
  })
}
const localVar = 111
const localFn = (localWar) => {
  console.log(`localWar: ${localWar}`)
}

const createMess = () => {
  showMessage('title2', 'body2')
}

const user = useUser()
const handleLogin = () => {
  if (user.value.isAuth) { // выходим из аккаунта
    Object.keys(user.value).forEach(key => delete user.value[key])
    user.value.isAuth = false
    // todo delete cookie
    // document.cookie = "cookiename= ; expires = Thu, 01 Jan 1970 00:00:00 GMT"
    // todo check page. If only for auth, go to home page
  } else { // входим
    user.value.showLogin = true
  }
}

</script>

<template>
  <header class="w-full bg-cyan-200">
    <div class="flex">
<!--      <TheCart />-->
<!--      <CatsMenu />-->
      <button class="button" @click="handleLogin"> {{ user.isAuth ? 'Log Out' : 'Log In'}}</button>
      <button class="button">
        <NuxtLink to="/admin">Admin</NuxtLink>
      </button>
      <button @click="createDialog" class="button">Create dialog</button>
      <button @click="createMess" class="button">Create mess</button>
      <button @click="showLoader()" class="button">Show loader</button>
      <button @click="showNotice('some text', 'error')" class="button">Show notice</button>
      <!--      <button @click="multiply" class="button">Multuply</button>-->
    </div>
    <div>
      <button class="button">
        <NuxtLink to="/catalog/shtangentsirkuli">ШТАНГЕНЦИРКУЛИ</NuxtLink>
      </button>
      <button class="button">
        <NuxtLink to="/catalog/shtangentsirkuli-shts-i-s-glubinomerom">ШЦ с глубиномером</NuxtLink>
      </button>
      <button class="button">
        <NuxtLink to="/user/orders">Orders</NuxtLink>
      </button>
      <button class="button">
        <NuxtLink to="/test_fetch">test_fetch</NuxtLink>
      </button>
      <button class="button">
        <NuxtLink to="/test1">/test1</NuxtLink>
      </button>
      <button class="button">
        <NuxtLink to="/test2">/test2</NuxtLink>
      </button>
      <button class="button" @click="test">test</button>
    </div>

  </header>
</template>
