<script setup>
//
definePageMeta({
  layout: 'empty',
})
const test = 111
cv({ test })
</script>

<template>
  <h1>Some {{ test }}</h1>
  <div class="h-200 w-200 bg-amber-300">
    <img
      :srcset="'/static/img/categories/w_800/glubinomery.jpg 800w'"
      sizes="400px"
      class="h-auto w-max" />
  </div>
</template>
