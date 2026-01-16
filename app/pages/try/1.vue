<script setup>
//
const searchQuery = ref('')
const result = ref(null)

const onSearch = async () => {
  console.log(`Searching for: ${searchQuery.value}`)
  result.value = await $fetch('/api/getData/searchNew?q=' + searchQuery.value)
  console.log(`Result: ${JSON.stringify(result.value.length, null, 2)}`)
}

const onCreate = async () => {
  console.log('Test button clicked')
  await $fetch('/api/getData/searchCreate')
}
</script>

<template>
  <h1>Test new search</h1>
  <UInput
    v-model="searchQuery"
    label="Search Query"
    placeholder="Enter search query"
    @keyup.enter="onSearch" />
  <UButton
    class="mx-4"
    @click="onCreate"
    label="searchCreate" />
  <div class="">
    <pre>{{ result }}</pre>
  </div>
</template>
