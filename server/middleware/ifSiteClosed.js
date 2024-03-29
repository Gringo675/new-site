export default defineEventHandler(async event => {
  // console.log(`from server middleware ifSiteClosed`)
  // console.log(`url: ${JSON.stringify(event.node.req.url, null, 2)}`)
  if (process.env.IS_SITE_CLOSED !== '1') return
  if (
    event.node.req.url.startsWith('/api/auth') ||
    event.node.req.url === '/api/user/getUser' ||
    event.node.req.url === '/api/console' ||
    event.node.req.url === '/favicon.ico' ||
    event.node.req.url.startsWith('/__nuxt_error')
  )
    return

  try {
    // проверяем, поступил ли запрос от админа
    await checkToken(event, {
      adminOnly: true,
    })
  } catch (e) {
    // если нет, завершаем с ошибкой
    // console.log(`from catch e: ${JSON.stringify(e, null, 2)}`)
    throw createError({ statusCode: 423, statusMessage: `Site temporarily closed. Please try later.` })
  }
})
