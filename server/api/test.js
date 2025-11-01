export default defineEventHandler(async event => {
  const cacheStorage = useStorage('cache')
  let keys = await cacheStorage.getKeys()
  console.log(`before keys: ${JSON.stringify(keys, null, 2)}`)

  for (const key of keys) {
    await cacheStorage.removeItem(key)
  }
  keys = await cacheStorage.getKeys()
  console.log(`after keys: ${JSON.stringify(keys, null, 2)}`)

  return 111
})
