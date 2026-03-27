<script setup>
//
definePageMeta({
  layout: 'empty',
})
</script>

<template>
  <div class="wrapper flex h-screen flex-col bg-yellow-200">
    <div class="header bg-blue-300 p-6">Header</div>
    <div class="content min-h-0 grow bg-red-400 p-6">
      <div class="h-200 bg-green-200">Item</div>
    </div>
  </div>
</template>
