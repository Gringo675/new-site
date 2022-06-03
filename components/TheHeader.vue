<script setup>


import {useMessage as message} from "../composables/state";

const createDialog = () => {
  message.show('My very very large title', '<p>paragraph with <i>italic</i> word</p>', 'success', ()=>{localFn(localVar)})}

const localVar = 111
const localFn = (localWar) => {
  console.log(`localWar: ${localWar}`)
}

const createMess = () => {
  message.show('title2', 'body2')
}
</script>

<template>
  <div class="TheHeader">
    HEADER
    <div>
      <button @click="createDialog" class="button">Create dialog</button>
      <button @click="createMess" class="button">Create mess</button>
    </div>

  </div>
</template>

<style lang="scss">
.TheHeader {
  width: 100%;
  height: 150px;
  background: aqua;
}
</style>