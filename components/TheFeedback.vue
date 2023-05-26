<script setup>
//
const feedbackData = useFeedbackData()
</script>

<template>
  <div class="">Feedback</div>
  <div>title: {{ feedbackData.title }}</div>
  <div>text: {{ feedbackData.text }}</div>
</template>
