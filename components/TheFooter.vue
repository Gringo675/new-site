<script setup>
const user = useUser().value
</script>

<template>
  <footer class="w-full h-32 bg-fuchsia-400">
    <div>user: {{ user }}</div>
    <div class="">
      <button
        @click="showFeedback('my title', 'my text')"
        class="button"
      >
        feedback
      </button>
    </div>
  </footer>
</template>
