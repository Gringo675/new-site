<script setup>

console.log(`!!!from test component!!!`)

defineProps({
  data: Object
})
</script>

<template>
  <div class="TheTest">
THE TEST component <br>
    data: {{data}}
  </div>
</template>

