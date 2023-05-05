export default defineEventHandler(async event => {
  const tokenUser = await checkToken(event)

  const newData = await readBody(event)

  const values = Object.keys(newData)
    .map(key => `${key} = '${prepareString(newData[key])}'`)
    .join(', ')

  const query = `UPDATE i_users SET ${values} WHERE id = ${tokenUser.id}`
  await dbReq(query)

  return true
})
