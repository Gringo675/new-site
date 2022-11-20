<script setup>

console.log(`!!!from test component!!!`)

defineProps({
  data: Object,
  pending: Object
})
</script>

<template>
  <div class="TheTest">
THE TEST component <br>
    data: {{data}} <br>
    pending: {{pending}}
  </div>
</template>

