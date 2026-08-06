export default defineWebSocketHandler({
  //
  // async open(peer) {
  //   console.log(`WebSocket connection opened: ${peer.id}`)
  // },

  async message(peer, message) {
    try {
      const data = JSON.parse(message.text())

      if (data.action === 'start') {
        const { workflowId, inputData, baseUrl, runId } = data

        const result = await executeMastraWorkflowPolling(baseUrl, workflowId, inputData, runId)

        if (result) {
          peer.send(JSON.stringify({ status: 'success', data: result }))
        } else {
          peer.send(JSON.stringify({ status: 'error', error: 'No result received' }))
        }
        peer.close()
      }
      // else if (message.text() === 'ping') {
      //   peer.send('pong')
      // }
    } catch (error) {
      peer.send(
        JSON.stringify({
          status: 'error',
          error: error.message || 'Internal Server Error',
        }),
      )
    }
  },

  // close(peer) {
  //   console.log(`WebSocket connection closed: ${peer.id}`)
  // },

  error(peer, error) {
    console.error(`WebSocket error for ${peer.id}:`, error)
    try {
      peer.send(
        JSON.stringify({
          status: 'error',
          error: error.message || 'WebSocket connection error',
        }),
      )
    } catch (e) {
      console.error(`Failed to send error message to ${peer.id}:`, e)
    } finally {
      peer.close()
    }
  },
})

async function executeMastraWorkflowPolling(baseUrl, workflowId, inputData, runId) {
  try {
    // runId may be provided for debugging purposes
    if (!runId) {
      ;({ runId } = await $fetch(`${baseUrl}/api/workflows/${workflowId}/create-run`, {
        method: 'POST',
      }))

      // console.log(`Run ID created: ${runId}`)

      await $fetch(`${baseUrl}/api/workflows/${workflowId}/start?runId=${runId}`, {
        method: 'POST',
        body: {
          inputData: inputData,
        },
      })
    }

    let status = 'running'
    let response = null

    while (status === 'running') {
      response = await $fetch(`${baseUrl}/api/workflows/${workflowId}/runs/${runId}?fields=result,error`)
      status = response?.status

      if (status === 'running') {
        await new Promise(resolve => setTimeout(resolve, 2000))
      }
    }

    if (status === 'success') {
      return response.result
    } else {
      throw new Error(`Workflow ended with status: ${status}. Error: ${JSON.stringify(response?.error)}`)
    }
  } catch (error) {
    console.error('Mastra polling error:', error)
    throw error
  }
}
