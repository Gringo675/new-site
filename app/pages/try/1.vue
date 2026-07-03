<script setup>
const result = ref(null)
const isLoading = ref(false)
const error = ref(null)
const statusMessage = ref('Ready to start workflow')

async function startWorkflow() {
  result.value = null
  error.value = null
  isLoading.value = true
  statusMessage.value = 'Connecting to server...'

  try {
    // Nitro WebSocket routes are typically accessed via ws:// or wss://
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const host = window.location.host
    // const socket = new WebSocket(`${protocol}//${host}/api/ttests675/mastraWebSocket`)
    const socket = new WebSocket(`/api/ttests675/mastraWebSocket`)

    socket.onopen = () => {
      statusMessage.value = 'Connected! Sending configuration...'
      console.log('WebSocket connected')

      // Send the configuration message to start the workflow
      const config = {
        action: 'start',
        workflowId: 'category-workflow',
        baseUrl: 'http://localhost:4111',
        inputData: {
          alias: 'nutromery-ni-v-vysokotochnye',
        },
      }
      socket.send(JSON.stringify(config))
    }

    socket.onmessage = event => {
      try {
        const response = JSON.parse(event.data)
        if (response.status === 'success') {
          result.value = response.data
          statusMessage.value = 'Workflow completed successfully!'
        } else if (response.status === 'info') {
          statusMessage.value = response.message || 'Processing...'
        } else {
          error.value = response.error || 'Unknown error occurred'
          statusMessage.value = 'Workflow failed.'
        }
      } catch (e) {
        console.error('Error parsing message:', e)
        error.value = 'Invalid response received from server'
      } finally {
        isLoading.value = false
      }
    }

    socket.onerror = event => {
      console.error('WebSocket error:', event)
      error.value = 'WebSocket connection error'
      statusMessage.value = 'Connection failed.'
      isLoading.value = false
    }

    socket.onclose = event => {
      console.log('WebSocket closed:', event.code, event.reason)
    }
  } catch (e) {
    error.value = e.message
    statusMessage.value = 'Error initiating connection.'
    isLoading.value = false
  }
}
</script>

<template>
  <div class="mx-auto max-w-4xl p-8">
    <h1 class="mb-4 text-2xl font-bold">Mastra Workflow Test (WebSocket)</h1>

    <div class="mb-6 flex items-center gap-4">
      <button
        @click="startWorkflow"
        :disabled="isLoading"
        class="rounded bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:bg-gray-400">
        {{ isLoading ? 'Processing...' : 'Start Workflow' }}
      </button>

      <span
        v-if="isLoading"
        class="flex items-center gap-2 text-gray-600">
        <span class="animate-spin">🌀</span>
        {{ statusMessage }}
      </span>
      <span
        v-else
        class="text-gray-600">
        {{ statusMessage }}
      </span>
    </div>

    <div
      v-if="error"
      class="mb-6 rounded border border-red-200 bg-red-100 p-4 text-red-700">
      <strong>Error:</strong>
      {{ error }}
    </div>

    <div
      v-if="result"
      class="mt-6">
      <h2 class="mb-2 text-lg font-semibold">Workflow Result:</h2>
      <pre class="max-h-96 overflow-auto rounded bg-gray-900 p-4 text-sm text-green-400">{{ JSON.stringify(result, null, 2) }}</pre>
    </div>
  </div>
</template>
