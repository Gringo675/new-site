<script setup>
import { useNuxtApp } from '#app/nuxt.js'

const test = () => {
  const route = useRoute()
  console.log(`route: ${JSON.stringify(route, null, 2)}`)
  const router = useRouter()
  // const nQuery = { ...route.query, aaa: 222 }
  // console.log(`nQuery: ${JSON.stringify(nQuery, null, 2)}`)
  // router.replace({ query: nQuery })
  const url = new URL(window.location)
  url.searchParams.set('f', '64-25-15')
  window.history.replaceState({}, '', url)
}

const createDialog = () => {
  showMessage('My very very large title', '<p>paragraph with <i>italic</i> word</p>', 'success', () => {
    localFn(localVar)
  })
}
const localVar = 111
const localFn = localWar => {
  console.log(`localWar: ${localWar}`)
}

const createMess = () => {
  showMessage('title2', 'body2')
}

// console.log(`from header`)
// const testH = await useTest()
// console.log(`testH: ${JSON.stringify(testH, null, 2)}`)
</script>

<template>
  <div class="w-full bg-cyan-200">
    <div class="flex -md:hidden">
      <CatsMenuWrapper />
      <ClientOnly>
        <TheUser />
        <TheCart />
      </ClientOnly>

      <button class="button">
        <NuxtLink to="/admin">Admin</NuxtLink>
      </button>
      <button
        @click="createDialog"
        class="button"
      >
        Create dialog
      </button>
      <button
        @click="createMess"
        class="button"
      >
        Create mess
      </button>
      <button
        @click="showLoader"
        class="button"
      >
        Show loader
      </button>
      <button
        @click="showNotice('some text', 'error')"
        class="button"
      >
        Show notice
      </button>
      <!--      <button @click="multiply" class="button">Multuply</button>-->
    </div>
    <div class="-md:hidden">
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
      <button
        class="button"
        @click="test"
      >
        test
      </button>
    </div>
    <TheSearch />
  </div>
</template>
