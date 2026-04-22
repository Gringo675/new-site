<script setup>
//
const onClick = () => {
  const aaa = ccc - fff
}
</script>

<template>
  <div class="p-4">
    <h1 class="mb-4 text-2xl font-bold">Try 3</h1>
    <button
      class="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
      @click="onClick">
      Click me to trigger an error
    </button>
  </div>
</template>
