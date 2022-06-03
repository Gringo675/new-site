<script setup>

import {useMessage as message} from "../composables/state";

</script>

<template>
  <div v-if="message.isShow"
       class="
       fixed left-0 right-0 top-0 bottom-0 z-50 bg-gray-300/60
       flex flex-col items-center justify-center
       ">
    <div class="w-96 max-w-[95%] max-h-[90vh]
         border border-amber-900 rounded-xl
         overflow-auto flex flex-col justify-start"
         :class="{'border-red-500': message.type === 'error', 'border-green-500': message.type === 'success'}">
      <div class="flex flex-row justify-between items-center bg-orange-300 p-2.5"
           :class="{'bg-red-400': message.type === 'error', 'bg-green-400': message.type === 'success'}">
        <div class="max-w-full whitespace-nowrap overflow-hidden overflow-ellipsis size text-xl">{{ message.title }}</div>
        <div class="bg-[url('/public/img/x-circle.svg')] bg-center bg-no-repeat bg-contain
                    w-7 h-7 ml-2 flex-shrink-0 cursor-pointer hover:scale-90 transition-transform"
             @click="message.hide"></div>
      </div>
      <div class="p-5 overflow-auto bg-amber-100">
        <div v-html="message.body"></div>
      </div>
      <div class="p-2.5 bg-orange-200 flex justify-end items-center">
        <button v-if="message.isDialog" @click="message.hide" class="button px-2 py-1">Cancel</button>
        <button @click="message.positiveAction" class="button px-2 py-1">OK</button>
      </div>
    </div>
  </div>
</template>

<style lang="scss">

</style>