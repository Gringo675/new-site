import crypto from 'crypto'

export default defineEventHandler(async event => {
  const { mail, code } = await readBody(event)

  if (!validateMail(mail)) throw createError({ statusCode: 400, statusMessage: `Incorrect mail format!` })
  if (isNaN(code) || code.length !== 5) throw createError({ statusCode: 400, statusMessage: `Incorrect code format!` })

  let query = `SELECT id, ver_code, admin FROM i_users WHERE mail = '${mail}' LIMIT 1`
  const user = (await dbReq(query))[0]
  if (!user) throw createError({ statusCode: 400, statusMessage: `Bad request!` })

  const [hash, salt] = user.ver_code.split('.')
  const currentHash = crypto.createHmac('SHA256', salt).update(`${code}`).digest('base64')

  if (currentHash !== hash) return false

  query = `UPDATE i_users SET ver_code = '' WHERE id = ${user.id}`
  await dbReq(query)

  createToken(user, event)

  // с вероятностью 10% запускаем очистку базы от пустых записей
  if (Math.random() < 0.1) clearUsersBase()

  return true
})
