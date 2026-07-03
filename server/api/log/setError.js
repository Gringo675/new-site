/**
 * Записывает ошибку в базу.
 */

export default defineEventHandler(async event => {
  const error = await readBody(event)
  // console.log(`error: ${JSON.stringify(error, null, 2)}`)

  if (!error || !error.statusCode || !error.statusMessage || !error.url || !error.stack || error.onServer === undefined) throw createError({ statusCode: 462, statusMessage: `Incorrect error format!` })

  const cTime = new Date().toISOString()
  const dbLogTable = getLogTableName()

  const query = `INSERT INTO ${dbLogTable} SET created = ?, error = 1, text = ?`
  await dbReq(query, [cTime, JSON.stringify(error)])

  // console.log(`post: ${JSON.stringify(post, null, 2)}`)
})
