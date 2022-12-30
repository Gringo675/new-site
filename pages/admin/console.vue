<script setup>

let eventSource
const isConnected = ref(false)
const messages = reactive([])

const startConnection = () => {
  // eventSource = new EventSource('http://localhost:8001/');
  let baseURL = useRuntimeConfig().app.baseURL
  if (baseURL[baseURL.length-1] === '/') baseURL = baseURL.substring(0, baseURL.length-1) // убираем слеш в конце
  eventSource = new EventSource(baseURL + '/api/console');

  eventSource.addEventListener('newConnection', event => {
    isConnected.value = true
    console.log(event.data); // Установлено новое соединение
  });

  eventSource.addEventListener('cv', event => {
    // console.log("Новое сообщение", JSON.parse(event.data));
    messages.push({
      time: new Date().toLocaleTimeString(),
      text: JSON.parse(event.data)
    })
  });
}
const closeConnection = () => {
  eventSource.close()
  isConnected.value = false
  console.log(`Соединение закрыто.`)
}
const toggleConnection = () => {
  if (isConnected.value) closeConnection()
  else startConnection()
}

const clearMessages = () => {
  messages.length = 0
}

// onMounted(() => {
//   startConnection()
// })


</script>

<template>
  <div class="console">
    <div class="flex items-center">
      <h1>Console</h1>
      <div class="m-5 w-5 h-5 rounded-full bg-red-400"
           :class="{'bg-green-400': isConnected, 'bg-red-400': !isConnected}"></div>
      <button class="button" @click="toggleConnection">{{ isConnected ? 'Close' : 'Open' }}</button>
      <button class="button" @click="clearMessages">Clear</button>
    </div>
    <div class="m-2 p-2 border border-green-300 rounded-2xl">
      <div class="my-1 p-1 hover:bg-gray-100 rounded-xl" v-for="mess in messages">
        <div class="text-blue-400">
          {{ mess.time }}
        </div>
        <div>
            <pre>{{ mess.text }}</pre>
        </div>


      </div>
    </div>
  </div>
</template>

<style>

</style>