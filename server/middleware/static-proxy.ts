export default defineEventHandler(event => {
  // this middleware don't work in production mode, cause all /static/* requests are handled by nginx

  const url = event.node.req.url

  if (url && url.startsWith('/static/')) {
    const path = url.substring('/static/'.length)
    const config = useRuntimeConfig(event)
    const target = `${config.STATIC_ABSOLUTE_PATH}${path}`
    return proxyRequest(event, target)
  }
})
