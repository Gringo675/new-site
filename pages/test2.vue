<script setup>

const isListen = ref(false)
const startListen = async () => {
  isListen.value = true
  console.log(`listen...`)
  while (isListen.value) {
    try {
      const data = await $fetch('/api/lpTest', {method: 'post'})
      if (isListen.value) console.log(`data: ${JSON.stringify(data, null, 2)}`)
    } catch (e) {
      console.error(e.message)
      await new Promise( resolve => setTimeout(resolve, 1000))
    }
  }
}
const stopListen = () => {
  isListen.value = false
  console.log(`stop listen`)
}

const sendData = async () => {
  console.log(`send...`)
  const data = await $fetch('/api/lpTest', {
    method: 'POST',
    body: 'someBody'
  })
  console.log(`data: ${JSON.stringify(data, null, 2)}`)
}

</script>

<template>
  <div class="">
      <h1>Test2</h1>
      <button class="button" @click="startListen">listen</button>
    <button class="button" @click="stopListen">stop</button>
    <button class="button" @click="sendData">send</button>
  </div>
</template>
