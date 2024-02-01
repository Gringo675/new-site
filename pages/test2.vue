<script setup>
//
const bbb = aaa * 2
const response = ref()

const onTest = async () => {
  response.value = await $fetch('/api/test')
}
</script>

<template>
  <div>
    <UButton
      label="Test"
      @click="onTest"
      class="m-2"
    />
  </div>
  <div>response: {{ response }}</div>
</template>
