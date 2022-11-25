<script setup>

const props = defineProps({
  error: Object
})

</script>

<template>
  <TheError :error="error" :isGlobal="true"/>
</template>