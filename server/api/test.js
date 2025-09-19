export default defineEventHandler(async event => {
  const url = getRequestURL(event)
  return {
    href: url.href,
    origin: url.origin,
    protocol: url.protocol,
    username: url.username,
    password: url.password,
    host: url.host,
    hostname: url.hostname,
    port: url.port,
    pathname: url.pathname,
    search: url.search,
    searchParams: Object.fromEntries(url.searchParams.entries()),
    hash: url.hash,
  }
})
