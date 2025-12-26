/**
 * Записывает текст в базу.
 */

export default defineEventHandler(async event => {
  const { text } = await readBody(event)

  if (typeof text !== 'string')
    throw createError({ statusCode: 462, statusMessage: `Incorrect text format! Text must be a non-empty string.` })

  const cTime = new Date().toISOString()

  const query = `INSERT INTO i_log SET created = '${cTime}', error = 0, text = '${prepareString(text)}'`
  await dbReq(query)
})
