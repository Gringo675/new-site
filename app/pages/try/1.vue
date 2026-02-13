<script setup>

const { sendGAEvent } = useAnalytics()

const onTest = () => {
  sendGAEvent('click', 'Test Page', 'UButton Test');
  console.log('Test analytics event triggered.');
};
</script>

<template>
  <div class="">
    <UButton @click="onTest">Test</UButton>
  </div>
</template>
