<script setup>
const searchState = reactive({
  input: '',
  pending: false,
  rejectRequest: null,
})
const startingRequest = async () => {
  await new Promise(resolve => setTimeout(resolve, 1000))
  searchState.pending = true
  const result = await new Promise(async (resolve, reject) => {
    searchState.rejectRequest = reject
    const request = await $fetch('/api/apiTest')
    resolve(request)
  })
  console.log(`result: ${JSON.stringify(result, null, 2)}`)
}
const cancelRequest = () => {
  searchState.pending = false
  if (searchState.rejectRequest) {
    searchState.rejectRequest()
    searchState.rejectRequest = null
  }
}
watch(
  () => searchState.input,
  input => {
    cancelRequest() // отменяем предыдущий запрос
    if (input.length > 2) startingRequest()
  }
)
</script>

<template>
  <UInput
    v-model="searchState.input"
    color="primary"
    variant="outline"
    placeholder="Search..."
    leading-icon="i-heroicons-magnifying-glass-20-solid"
    :loading="searchState.pending"
    :ui="{ icon: { trailing: { pointer: '' } } }"
    class="w-64 m-4"
  >
    <template #trailing>
      <UButton
        v-show="searchState.input !== ''"
        color="gray"
        variant="link"
        icon="i-heroicons-x-mark-20-solid"
        :padded="false"
        @click="searchState.input = ''"
      />
    </template>
  </UInput>
</template>
