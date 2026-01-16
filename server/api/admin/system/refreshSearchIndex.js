export default defineEventHandler(async event => {
  //
  try {
    const count = await refreshSearchIndex()

    return { status: 'ok', count }
  } catch (e) {
    console.error(e)
    return { status: 'error', message: e }
  }
})
