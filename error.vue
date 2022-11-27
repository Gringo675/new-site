<script setup>
console.log(`from globalError`)

const props = defineProps({
  error: Object
})

</script>

<template>
  from globalError
  <TheError :error="error" :isGlobal="true"/>
</template>