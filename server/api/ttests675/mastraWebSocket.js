export default defineWebSocketHandler({
  async open(peer) {
    console.log(`WebSocket connection opened: ${peer.id}`)
  },

  async message(peer, message) {
    try {
      const data = JSON.parse(message.text())

      if (data.action === 'start') {
        const { workflowId, inputData, baseUrl } = data

        if (!workflowId) {
          peer.send(JSON.stringify({ status: 'error', error: 'workflowId is required' }))
          return
        }

        console.log(`Starting workflow ${workflowId} for peer ${peer.id}...`)
        const result = await executeMastraWorkflowPolling(baseUrl, workflowId, inputData)

        if (result) {
          peer.send(JSON.stringify({ status: 'success', data: result }))
        } else {
          peer.send(JSON.stringify({ status: 'failed', error: 'No result received' }))
        }
        peer.close()
      }
    } catch (error) {
      console.error('Message handling error:', error)
      peer.send(JSON.stringify({ status: 'error', error: 'Invalid message format' }))
    }
  },

  close(peer) {
    console.log(`WebSocket connection closed: ${peer.id}`)
  },

  error(peer, error) {
    console.error(`WebSocket error for ${peer.id}:`, error)
  },
})

async function executeMastraWorkflowPolling(baseUrl, workflowId, inputData) {
  try {
    console.log('Creating run...')
    const { runId } = await $fetch(`${baseUrl}/api/workflows/${workflowId}/create-run`, {
      method: 'POST',
    })

    console.log(`Run ID created: ${runId}`)

    console.log('Starting run...')
    await $fetch(`${baseUrl}/api/workflows/${workflowId}/start?runId=${runId}`, {
      method: 'POST',
      body: {
        inputData: inputData,
      },
    })

    console.log('Polling for result...')
    let status = 'running'
    let result = null

    while (status === 'running') {
      result = await $fetch(`${baseUrl}/api/workflows/${workflowId}/runs/${runId}?fields=result,error`)
      status = result?.status

      if (status === 'running') {
        await new Promise(resolve => setTimeout(resolve, 5000))
      }
    }

    if (status === 'success') {
      console.log('Workflow completed successfully!')
      return result
    } else {
      throw new Error(`Workflow ended with status: ${status}. Error: ${JSON.stringify(result?.error)}`)
    }
  } catch (error) {
    console.error('Mastra polling error:', error)
    throw error
  }
}
