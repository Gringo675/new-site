<script setup>
//
const isOpen = true
</script>

<template>
  <div>The Test</div>
  <UModal v-model="isOpen">
    <div class="p-4">
      <Placeholder class="h-48" />
    </div>
  </UModal>
</template>
