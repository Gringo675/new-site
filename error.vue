<script setup>
console.log(`from globalError`)

const props = defineProps({
  error: Object,
})
// console.log(`props.error: ${JSON.stringify(props.error, null, 2)}`)
</script>

<template>
  <TheError
    :error="error"
    :isGlobal="true"
  />
  <HelperClientComponents />
</template>
