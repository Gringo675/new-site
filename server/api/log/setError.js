/**
 * Записывает ошибку в базу.
 */

export default defineEventHandler(async event => {
  const error = await readBody(event)
  // console.log(`error: ${JSON.stringify(error, null, 2)}`)

  if (!error || !error.code || !error.message || !error.path || !error.stack || error.onServer === undefined)
    throw createError({ statusCode: 400, statusMessage: `Incorrect error format!` })

  const cTime = new Date().toISOString()

  const query = `INSERT INTO i_log SET created = '${cTime}', error = 1, text = '${JSON.stringify(error)}'`
  await dbReq(query)

  // console.log(`post: ${JSON.stringify(post, null, 2)}`)
})
