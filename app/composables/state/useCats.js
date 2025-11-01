// todo: error handling
export default () => {
  return useFetch('/api/getData/categories', {
    getCachedData: key => useNuxtData(key).data?.value,
    dedupe: 'defer',
    deep: false,
  })
}
