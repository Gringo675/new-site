<script setup>
let eventSource

const start = () => {
  eventSource = new EventSource('/api/sseTest2');

  eventSource.onmessage = function (event) {
    console.log("Новое сообщение", event.data);
  }
}

const close = () => {
  console.log(`from close`)
  eventSource.close()
}
</script>

<template>
  <div class="console">
    <h1>Console</h1>
    <button class="button" @click="start">start</button>
    <button class="button" @click="close">close</button>
  </div>
</template>

<style>

</style>