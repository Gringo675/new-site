/**
 * Получает массив объектов измененных значений типа [{field, value}]
 */

export default defineEventHandler(async event => {
  const tokenUser = await checkToken(event)

  const newData = await readBody(event)
  if (!newData.length) throw createError({ statusCode: 400, statusMessage: `Incorrect data format!` })

  // todo: data verification
  const values = newData.map(item => `${item.field} = '${prepareString(item.value)}'`).join(', ')

  const query = `UPDATE i_users SET ${values} WHERE id = ${tokenUser.id}`
  await dbReq(query)

  return true
})
