export default defineEventHandler(async event => {
  // функция по алиасу отдает статический контент
  // на данный момент не используется

  const alias = getRouterParam(event, 'cont_alias')
  if (!alias.length) throw createError({ statusCode: 500, statusMessage: 'Incorrect URI!' })

  const content = (await dbReq(`SELECT text FROM i_content WHERE alias = '${alias}' LIMIT 1`))[0]

  if (!content) throw createError({ statusCode: 404, statusMessage: 'Content not found!' })

  return content.text || ''
})
