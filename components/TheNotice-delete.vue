<script setup>
//
const noticeData = useNoticeData()
</script>

<template>
  <div class="fixed bottom-[-200px] flex justify-center w-full z-20 text-center bg-red-600">
    <div
      class="relative bottom-[220px] py-2 px-5 rounded-2xl shadow-md max-w-[80%]"
      :class="{
        'bg-cyan-200 ': noticeData.type === 'info',
        'bg-emerald-200': noticeData.type === 'success',
        'bg-rose-400': noticeData.type === 'error',
      }"
      v-html="noticeData.text"
    ></div>
  </div>
</template>
