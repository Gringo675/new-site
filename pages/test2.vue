<script setup>
//
const controller = new AbortController()

const startFunc = async () => {
  try {
    console.log(`response started`)
    const response = await fetch('/test/api/getSearch?q=ttt', { signal: controller.signal })
    console.log(`response ended`)
  } catch (e) {
    console.log(`e: ${JSON.stringify(e, null, 2)}`)
  }
}
</script>

<template>
  <button
    class="button"
    @click="startFunc"
  >
    Start
  </button>
  <button
    class="button"
    @click="controller.abort()"
  >
    Abort
  </button>
</template>
