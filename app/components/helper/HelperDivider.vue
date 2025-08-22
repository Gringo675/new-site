<script setup>
//
defineProps({
  text: String,
})
</script>

<template>
  <div class="relative mx-auto my-6 w-full">
    <div class="absolute top-1/2 h-5 w-full -translate-y-0.5 overflow-hidden">
      <div class="-mt-6 h-6 rounded-[125px/12px] shadow-md shadow-violet-200"></div>
    </div>
    <div
      class="text-primary relative mx-auto w-fit rounded-full border border-violet-200 bg-violet-50 px-4 py-2 text-center text-lg font-bold italic shadow-md shadow-violet-200">
      {{ text }}
    </div>
  </div>
</template>
