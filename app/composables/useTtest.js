export default () => {
  return useFetch('/api/apiTest', {
    getCachedData: key => useNuxtData(key).data?.value,
    dedupe: 'defer',
    deep: false,
    onRequest({ request, options }) {
      console.log(`from onRequest`)
      console.log(`onRequest request: ${JSON.stringify(request, null, 2)}`)
      console.log(`onRequest options: ${JSON.stringify(options, null, 2)}`)
    },
    onRequestError({ request, options, error }) {
      console.log(`from onRequestError`)
      console.log(`onRequestError error: ${JSON.stringify(error, null, 2)}`)
      console.log(`onRequestError request: ${JSON.stringify(request, null, 2)}`)
      console.log(`onRequestError options: ${JSON.stringify(options, null, 2)}`)
    },
    onResponseError({ request, response, options }) {
      console.log(`from onResponseError`)
      console.log(`onResponseError request: ${JSON.stringify(request, null, 2)}`)
      console.log(`onResponseError response: ${JSON.stringify(response, null, 2)}`)
      console.log(`onResponseError options: ${JSON.stringify(options, null, 2)}`)
      createError({ statusCode: 405, statusMessage: 'Page Not Found' })
    },
  })
}
