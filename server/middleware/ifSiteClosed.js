export default defineEventHandler(async event => {
  // console.log(`from server middleware ifSiteClosed`)
  // console.log(`url: ${JSON.stringify(event.node.req.url, null, 2)}`)
  if (process.env.IS_SITE_CLOSED !== '1') return
  const { path } = event
  if (/^(\/api\/auth|\/api\/user\/getUser|\/api\/console|\/favicon\.ico|\/__nuxt_error)/.test(path)) return

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
