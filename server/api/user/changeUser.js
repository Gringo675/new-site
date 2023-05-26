/**
 * Получает массив объектов измененных значений типа [{field, value}]
 */

export default defineEventHandler(async event => {
  const tokenUser = await checkToken(event)

  const newData = await readBody(event)
  if (!newData.length) throw createError({ statusCode: 400, statusMessage: `Incorrect data format!` })
  verifyData(newData)

  const values = newData.map(item => `${item.field} = '${prepareString(item.value)}'`).join(', ')
  const query = `UPDATE i_users SET ${values} WHERE id = ${tokenUser.id}`
  await dbReq(query)

  return true
})

const verifyData = data => {
  //
  for (const item of data) {
    switch (item.field) {
      case 'name':
        if (item.value.length < 2) throw createError({ statusCode: 400, statusMessage: `Incorrect name format!` })
        break
      case 'mail':
        if (!validateMail(item.value)) throw createError({ statusCode: 400, statusMessage: `Incorrect mail format!` })
        break
      case 'org':
        if (item.value.length && item.value.length < 5)
          throw createError({ statusCode: 400, statusMessage: `Incorrect organization format!` })
        break
      case 'inn':
        if (item.value.length && (isNaN(item.value) || (item.value.length !== 10 && item.value.length !== 12)))
          throw createError({ statusCode: 400, statusMessage: `Incorrect inn format!` })
        break
      case 'address':
        if (item.value.length && item.value.length < 5)
          throw createError({ statusCode: 400, statusMessage: `Incorrect address format!` })
        break
      case 'phone':
        if (item.value.length && !validatePhone(item.value))
          throw createError({ statusCode: 400, statusMessage: `Incorrect phone format!` })
        break
    }
  }
}
