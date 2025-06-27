<script setup>
definePageMeta({
  layout: 'empty',
})

const nodeVersion = useState('nv', () => process.version)
</script>

<template>
  <div class="m-20 bg-gray-800">
    <h1 class="text-2xl text-white">Node Version</h1>
    <p class="text-lg text-gray-300">{{ nodeVersion }}</p>
    <p class="text-lg text-gray-300">This page is for testing purposes.</p>
  </div>
</template>
