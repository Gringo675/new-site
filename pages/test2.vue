<script setup>
//
definePageMeta({
  layout: 'empty',
})
</script>

<template>
  <div class="ccontainer h-[500px] flex flex-col m-5 bg-green-300">
    <div class="w-full h-[200px] bg-red-300 relative">1</div>
    <div class="w-full h-[40px] bg-orange-300 absolute top-1/2">2</div>
    <div class="w-full h-[100px] bg-blue-300">3</div>
  </div>
</template>
