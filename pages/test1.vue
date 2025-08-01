<script setup>
//

const response = shallowRef(null)
const onTest1 = async () => {
  const request = {
    // productIds: [120002, 120003, 120006],
    labelId: 5,
  }
  response.value = await myFetch('/api/getProducts', {
    method: 'post',
    payload: request,
    silent: true,
  })
}
</script>

<template>
  <div>
    <UButton
      icon="i-heroicons-user"
      size="md"
      truncate
      class="rounded-full"
      @click="onTest1"
      label="Test1" />
  </div>
  <div class="">{{ response }}</div>
</template>
