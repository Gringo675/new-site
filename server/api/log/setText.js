/**
 * Записывает текст в базу.
 */

export default defineEventHandler(async event => {
  const { text } = await readBody(event)

  if (typeof text !== 'string')
    throw createError({ statusCode: 462, statusMessage: `Incorrect text format! Text must be a non-empty string.` })

  const cTime = new Date().toISOString()
  const dbLogTable = getLogTableName()

  const query = `INSERT INTO ${dbLogTable} SET created = '${cTime}', error = 0, text = '${prepareString(text)}'`
  await dbReq(query)
})
