<script setup>
//

const onTest = async () => {
  const response = await myFetch('/api/apiTest')
}
</script>

<template>
  <UButton
    label="Test"
    @click="onTest"
    class="m-2"
  />
</template>
