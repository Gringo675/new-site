<script setup>
const props = defineProps({
  error: Object
})

console.log(`props.error: ${JSON.stringify(props.error, null, 2)}`)

const handleError = () => clearError({ redirect: '/' })

</script>

<template>
  <TheHeader/>
  <h1>ERROR PAGE</h1>
  <h2>Code - {{ error.statusCode }}</h2>
  <button class="m-2 p-2 bg-cyan-500" @click="handleError">Clear errors</button>
</template>