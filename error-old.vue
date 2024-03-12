<script setup>
const props = defineProps({
  error: Object,
})
</script>

<template>
  <div>
    <NuxtLayout>
      <h1>Global Error</h1>
      <TheError
        :error="error"
        :isGlobal="true"
      />
      <HelperClientComponents />
    </NuxtLayout>
  </div>
</template>
