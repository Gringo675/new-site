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

const localVar = 111
const localFn = localWar => {
  console.log(`localWar: ${localWar}`)
}

const createMess = () => {
  showMessage({
    title: 'Some very big title with long long words about everything',
    description: 'some description',
    type: 'success',
    // preventClose: false,
    callback: () => localFn(localVar),
  })
}

const createFeedback = () => {
  showFeedback({
    title: 'My title',
    description: 'some description',
  })
}

// console.log(`from header`)
// const testH = await useTest()
// console.log(`testH: ${JSON.stringify(testH, null, 2)}`)
</script>

<template>
  <div class="w-full bg-secondary-200">
    <div class="-sm:hidden flex items-center gap-x-2 flex-wrap">
      <CatsMenuWrapper />
      <ClientOnly>
        <TheUser />
        <TheCart />
      </ClientOnly>

      <UButton
        label="Admin"
        to="/admin"
        color="secondary"
      />
      <UButton
        label="Create mess"
        @click="createMess"
        color="secondary"
      />
      <UButton
        label="Show loader"
        @click="showLoader"
        color="secondary"
      />
      <UButton
        label="Show notice"
        color="secondary"
        @click="showNotice({ title: 'some title', description: 'some description', type: 'success' })"
      />
      <UButton
        label="Show feedback"
        color="secondary"
        @click="createFeedback"
      />
      <!--      <button @click="multiply" class="button">Multuply</button>-->
    </div>
    <div class="-sm:hidden flex items-center gap-x-2 flex-wrap">
      <UButton
        label="ШТАНГЕНЦИРКУЛИ"
        to="/catalog/shtangentsirkuli"
      />
      <UButton
        label="ШЦ с глубиномером"
        to="/catalog/shtangentsirkuli-shts-i-s-glubinomerom"
      />
      <UButton
        label="Orders"
        to="/user/orders"
      />
      <UButton
        label="test_fetch"
        to="/test_fetch"
      />
      <UButton
        label="test1"
        to="/test1"
      />
      <UButton
        label="test2"
        to="/test2"
      />
    </div>
    <TheSearch />
  </div>
</template>
