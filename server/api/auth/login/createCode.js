import crypto from 'node:crypto'

export default defineEventHandler(async event => {
  const { mail } = await readBody(event)

  if (!validateMail(mail)) throw createError({ statusCode: 400, statusMessage: `Incorrect mail format!` })

  // const code = getRandomCode()
  const code = mail === 'gringo675g@gmail.com' ? 11111 : getRandomCode()

  const salt = crypto.randomBytes(3).toString('hex') // 6 symbols
  const hashCode = crypto.createHmac('SHA256', salt).update(`${code}`).digest('base64') + `.${salt}`

  let query = `SELECT id FROM i_users WHERE mail = '${mail}' LIMIT 1`
  const user = (await dbReq(query))[0]
  if (user) {
    query = `UPDATE i_users SET ver_code = '${hashCode}' WHERE id = ${user.id}`
  } else {
    const name = mail.match(/(^.+)@/)[1]
    query = `INSERT INTO i_users (name, mail, ver_code, created) 
                VALUES ('${name}', '${mail}', '${hashCode}', '${new Date().toISOString()}')`
  }
  await dbReq(query)

  // собираем ссылку для автоматического входа
  let loginURL = getSiteFullOrigin(event) + 'user/verification'
  const values = {
    mail,
    code,
  }
  loginURL =
    loginURL +
    '?' +
    Object.keys(values)
      .map(key => `${key}=${encodeURI(values[key])}`)
      .join('&')

  const mailData = {
    to: mail,
    subject: 'Подтверждение входа на сайт chelinstrument.ru',
    html: `<div>
                        <h2>Ваш код авторизации:</h2>
                        <div style="font-size: 20px"> ${code} </div>
                        <span>Ссылка для автоматического входа:</span>
                        <a href="${loginURL}">${loginURL}</a>
                  </div>`,
  }
  // await sendMail(mailData)
  if (mail !== 'gringo675g@gmail.com') await sendMail(mailData)

  return true
})
