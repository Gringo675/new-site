<script setup>
console.log(`!!!from test component!!!`)
// throw createError({ statusCode: 404, statusMessage: 'Page Not Found!!!!'})

defineProps({
  data: Object,
  pending: Boolean
})
const aaa = JSON.stringify(data)

</script>

<template>
  <div class="TheTest">
THE TEST component <br>
    data: {{data}} <br>
    pending: {{pending}}
  </div>
</template>

