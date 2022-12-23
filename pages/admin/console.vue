<script setup>
let eventSource = new EventSource('/api/sseTest');

eventSource.onmessage = function (event) {
  console.log("Новое сообщение", event.data);
}

const test = () => {
  eventSource.close()
}
</script>

<template>
  <div class="console">
    <h1>Console</h1>
    <button class="button" @click="test">Test</button>
  </div>
</template>

<style>

</style>