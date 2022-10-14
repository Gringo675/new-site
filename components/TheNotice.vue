<script setup>
import {useNotice} from "~/composables/common/notice"

const notice = useNotice()

</script>

<template>
  <Transition name="transition-informer">
    <div v-if="notice.isActive"
         class="fixed bottom-[-200px] flex justify-center w-full z-20 text-center bg-red-600"
    >
      <div
          class="relative bottom-[220px] py-2 px-5 rounded-2xl shadow-md max-w-[80%]"
          :class="{'bg-cyan-200 ':notice.type==='info',
                   'bg-emerald-200':notice.type==='success',
                   'bg-rose-400':notice.type==='error'}"
          v-html="notice.text"
      >
      </div>
    </div>
  </Transition>
</template>

<style>

</style>