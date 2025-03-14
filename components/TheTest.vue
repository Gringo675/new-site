<script setup>
//
const screen = useScreen()
</script>

<template>
  <div>
    <div>The Test</div>
    <div>Screen: {{ screen.isMobile ? 'Mobile' : 'Desktop' }}</div>
  </div>
</template>
