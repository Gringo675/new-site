<script setup>
const f1 = async () => {
  await f2()
}
const f2 = async () => {
  throw createError({ statusCode: 418, statusMessage: `Some error` })
}
</script>

<template>
  <div>The Test</div>
  <div>
    <button
      @click="f1"
      class="button"
    >
      test11
    </button>
  </div>
</template>
