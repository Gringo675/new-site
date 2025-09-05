export default defineEventHandler(async event => {
  const requestURL = getRequestURL(event)
  let xForwardedProto = getRequestHeader(event, 'x-forwarded-proto')
  let xForwardedHost = getRequestHeader(event, 'x-forwarded-host')
  // Берём только первый элемент до запятой (если есть)
  if (xForwardedProto && xForwardedProto.includes(',')) xForwardedProto = xForwardedProto.split(',')[0].trim()
  if (xForwardedHost && xForwardedHost.includes(',')) xForwardedHost = xForwardedHost.split(',')[0].trim()
  const xForwardedPort = getRequestHeader(event, 'x-forwarded-port')
  const xForwardedSsl = getRequestHeader(event, 'x-forwarded-ssl')
  const host = getRequestHeader(event, 'host')

  // Вариант 1: стандартный getRequestURL
  const origin1 = requestURL.origin

  // Вариант 2: ручная сборка из x-forwarded-proto/host
  let proto = xForwardedProto || (xForwardedSsl === 'on' ? 'https' : requestURL.protocol.replace(':', ''))
  let hostHeader = xForwardedHost || host
  let port = xForwardedPort
  let origin2 = proto && hostHeader ? `${proto}://${hostHeader}${port ? ':' + port : ''}` : null

  // Вариант 3: только host header
  let origin3 = host ? `${requestURL.protocol}//${host}` : null

  return {
    requestURL: {
      href: requestURL.href,
      origin: requestURL.origin,
      protocol: requestURL.protocol,
      host: requestURL.host,
      hostname: requestURL.hostname,
      pathname: requestURL.pathname,
    },
    headers: {
      'x-forwarded-proto': xForwardedProto,
      'x-forwarded-host': xForwardedHost,
      'x-forwarded-port': xForwardedPort,
      'x-forwarded-ssl': xForwardedSsl,
      host,
    },
    origin1_getRequestURL: origin1,
    origin2_xforwarded: origin2,
    origin3_host: origin3,
  }
})
