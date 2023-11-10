<script setup>
const user = useUser().value

// console.log(`from footer`)
// const testF = await useTest()
// console.log(`testF: ${JSON.stringify(testF, null, 2)}`)
</script>

<template>
  <div class="w-full bg-fuchsia-400">
    <div>user: {{ user }}</div>
    <div class="">
      <button
        @click="showFeedback('my title', 'my text')"
        class="button"
      >
        feedback
      </button>
    </div>
  </div>
</template>
