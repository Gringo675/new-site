<script setup>
//
const props = defineProps({
  error: Object,
})

const error = computed(() => {
  return {
    code: props.error.statusCode,
    message: props.error.statusMessage || props.error.message,
  }
})
const test = async () => {
  // await clearError()
  await navigateTo('/test2')
  // showLoader()
  // throw new Error('error from error')
  // const bbb = aaa * 2
}
</script>

<template>
  <div>
    <NuxtLayout>
      <h1>Error!</h1>
      <div>Error.code: {{ props.error.statusCode }}</div>
      <div>Error.message: {{ props.error.message }}</div>
      <div>Error.statusMessage: {{ props.error.statusMessage }}</div>

      <h2>===Computed===</h2>
      <div>Error.code: {{ error.code }}</div>
      <div>Error.message: {{ error.message }}</div>
      <UButton
        label="Test"
        @click="test"
      />
      <UButton
        label="На главную"
        @click="clearError({ redirect: '/' })"
      />
    </NuxtLayout>
  </div>
</template>
