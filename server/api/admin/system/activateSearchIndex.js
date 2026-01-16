export default defineEventHandler(async event => {
  //
  try {
    const count = await activateSearchIndex()

    return { status: 'ok', count }
  } catch (e) {
    console.error(e)
    return { status: 'error', message: e }
  }
})
