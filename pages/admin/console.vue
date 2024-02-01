<script setup>
const isListen = ref(false)
const messages = reactive([])

const startListen = async () => {
  isListen.value = true
  console.log(`listen...`)
  while (isListen.value) {
    try {
      const data = await $fetch('/api/console', { method: 'post' })
      if (isListen.value) {
        console.log(`data: ${JSON.stringify(data, null, 2)}`)
        if (data.length) {
          const newMessages = JSON.parse(data)
          if (newMessages.length) messages.push(...newMessages)
        }
      }
    } catch (e) {
      console.error(e.message)
      isListen.value = confirm(`Ошибка получения данных!\nError ${e.statusCode}: ${e.statusMessage}\nПовторить?`)
    }
  }
}
const stopListen = () => {
  isListen.value = false
  console.log(`stop listen`)
}
const toggleListen = () => {
  if (isListen.value) stopListen()
  else startListen()
}

const clearMessages = () => {
  messages.length = 0
}

// onMounted(() => {
//   startListen()
// })

const sendTestData = async () => {
  // console.log(`send...`)
  const data = await $fetch('/api/console', {
    method: 'POST',
    body: { text: 'Test' },
  })
  // console.log(`data: ${JSON.stringify(data, null, 2)}`)
}

const test = async () => {
  console.log(`test...`)
  try {
    const data = await $fetch('/api/apiTest')
    console.log(`data: ${JSON.stringify(data, null, 2)}`)
  } catch (e) {
    console.log(`e: ${JSON.stringify(e, null, 2)}`)
  }
}
</script>

<template>
  <h1>Console</h1>
  <div class="flex space-x-4">
    <UButton
      :label="isListen ? 'Stop' : 'Start'"
      @click="toggleListen"
    />
    <UButton
      label="Clear"
      @click="clearMessages"
    />
    <UButton
      label="Test"
      @click="sendTestData"
    />
  </div>
  <div class="m-2 p-2 border border-green-300 rounded-2xl">
    <div
      class="my-1 p-1 hover:bg-gray-100 rounded-xl"
      v-for="mess in messages"
    >
      <div class="text-blue-400">
        {{ mess.time }}
      </div>
      <div>
        <pre>{{ mess.text }}</pre>
      </div>
    </div>
  </div>
</template>

<style></style>
