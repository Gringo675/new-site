<script setup>

import loader from "~/composables/common/loader"
import message from "~/composables/common/message"
import {showNotice} from "~/composables/common/notice"

// import {useTest, multiply} from "~/composables/common/test"
// const test = useTest()
// console.log(`testttt: ${JSON.stringify(test, null, 2)}`)
//


const createDialog = () => {
  message.show('My very very large title', '<p>paragraph with <i>italic</i> word</p>', 'success', () => {
    localFn(localVar)
  })
}

const localVar = 111
const localFn = (localWar) => {
  console.log(`localWar: ${localWar}`)
}

const createMess = () => {
  message.show('title2', 'body2')
}

</script>

<template>
  <header class="w-full bg-cyan-200">
    <div class="flex">
<!--      <TheCart />-->
      <CatsMenu />
      <button @click="createDialog" class="button">Create dialog</button>
      <button @click="createMess" class="button">Create mess</button>
      <button @click="loader.show()" class="button">Show loader</button>
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
        <NuxtLink to="/user/login">LOGIN</NuxtLink>
      </button>
      <button class="button">
        <NuxtLink to="/test_err">test_err</NuxtLink>
      </button>
    </div>

  </header>
</template>
