<script setup>
const user = useUser().value

const feedback = useFeedback()

const showFeedback = () => (feedback.value.isActive = true)
</script>

<template>
  <footer class="w-full h-32 bg-fuchsia-400">
    <div>user: {{ user }}</div>
    <div class="">
      <button
        @click="showFeedback"
        class="button"
      >
        feedback
      </button>
    </div>
  </footer>
</template>
