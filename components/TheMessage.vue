<script setup>
import {useMessage as message} from "../composables/state";

</script>

<template>
  <Transition name="transition-fade">
    <HelperModalWrapper v-if="message.isShow">
      <div class="modal-form w-96 max-w-[95%] max-h-[90vh]
         border border-amber-900 rounded-xl
         overflow-auto flex flex-col justify-start"
           :class="{'border-red-500': message.type === 'error', 'border-green-500': message.type === 'success'}">
        <div class="flex flex-row justify-between items-center bg-orange-300 p-2.5"
             :class="{'bg-red-400': message.type === 'error', 'bg-green-400': message.type === 'success'}">
          <div class="max-w-full whitespace-nowrap overflow-hidden overflow-ellipsis size text-xl">{{
              message.title
            }}
          </div>
        </div>
        <div class="p-5 overflow-auto bg-amber-100">
          <div v-html="message.body"></div>
        </div>
        <div class="p-2.5 bg-orange-200 flex justify-end items-center">
          <button v-if="message.isDialog" @click="message.hide" class="button px-2 py-1">Cancel</button>
          <button @click="message.positiveAction" class="button px-2 py-1">OK</button>
        </div>
      </div>
    </HelperModalWrapper>
  </Transition>
</template>

<style lang="scss">

</style>