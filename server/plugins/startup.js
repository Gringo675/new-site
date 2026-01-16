export default defineNitroPlugin(async nitroApp => {
  // Activate search index on server startup
  try {
    const count = await activateSearchIndex()

    if (count > 0) console.log(`Search index activated on startup with ${count} documents.`)
    else throw new Error('Search index activated, but has no documents!')
  } catch (e) {
    $fetch('/api/log/setError', {
      method: 'POST',
      body: {
        statusCode: 777,
        statusMessage: `Error activating search index : ${e.message}`,
        url: '/api/admin/system/activateSearchIndex',
        stack: e.stack,
        onServer: true,
      },
    })
    console.error(e)
    return { status: 'error', message: e }
  }
})
