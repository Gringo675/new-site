<script setup>
//
const { props } = defineProps({
  props: {
    type: Array,
    default: () => [],
  },
})
</script>

<template>
  <div>
    <h1>Свойства</h1>
    <pre>{{ props }}</pre>
  </div>
</template>
