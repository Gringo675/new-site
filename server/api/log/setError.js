/**
 * Записывает ошибку в базу.
 */

export default defineEventHandler(async event => {
  try {
    const error = await readBody(event)
    if (!error) return { success: false }

    const cTime = new Date()
    const dbLogTable = getLogTableName()

    const query = `INSERT INTO ${dbLogTable} SET created = ?, error = 1, text = ?`
    let text
    try {
      text = typeof error === 'string' ? error : JSON.stringify(error)
    } catch {
      text = JSON.stringify({
        statusCode: 500,
        statusMessage: '[Log Error]: Failed to serialize error payload',
        url: '[server:setError]',
        onServer: true,
      })
    }

    await dbReq(query, [cTime, text], { skipErrorLog: true })

    return { success: true }
  } catch {
    return { success: false }
  }
})
