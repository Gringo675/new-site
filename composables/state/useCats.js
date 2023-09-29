const helper = {
  pending: false,
  savedRequests: [],
}

export default async () => {
  const catsState = useState('catsState', () => null)
  // check if we have cached value
  if (catsState.value) return catsState.value

  // check if request going now
  if (helper.pending) {
    return await new Promise(resolve => {
      helper.savedRequests.push(resolve)
    })
  }
  // doing request
  helper.pending = true
  try {
    catsState.value = await $fetch('/api/getCategories')
  } catch (e) {
    catsState.value = [] // fallback
  }
  helper.pending = false
  // handle saved requests
  if (helper.savedRequests.length) {
    for (const resolve of helper.savedRequests) resolve(catsState.value)
    helper.savedRequests.length = 0
  }

  return catsState.value
}
