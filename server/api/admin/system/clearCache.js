export default defineEventHandler(async event => {
  //
  try {
    const cacheStorage = useStorage('cache')
    const keys = await cacheStorage.getKeys()

    for (const key of keys) {
      await cacheStorage.removeItem(key)
    }

    return { status: 'ok' }
  } catch (e) {
    console.error(e)
    return { status: 'error', message: e }
  }
})
