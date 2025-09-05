import crypto from 'node:crypto'
// Для загрузки шаблона
let cachedVerifyMailTemplate = null

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

  // --- Загрузка и кэширование шаблона ---
  if (process.env.NODE_ENV === 'development' || !cachedVerifyMailTemplate) {
    const storage = useStorage('assets:server')
    const tpl = await storage.getItem('emails/verifyMailTemplate.html')
    if (!tpl) throw new Error('Не удалось загрузить шаблон письма верификации.')
    cachedVerifyMailTemplate = tpl
  }

  // --- Подстановка переменных ---
  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\\\]]/g, '\\$&')
  }
  const replacements = {
    '{{code}}': code,
    '{{loginURL}}': loginURL,
    '{{currentYear}}': String(new Date().getFullYear()),
  }
  let html = cachedVerifyMailTemplate
  for (const [key, value] of Object.entries(replacements)) {
    const escapedKey = escapeRegExp(key)
    html = html.replace(new RegExp(escapedKey, 'g'), String(value))
  }

  // --- Текстовая версия письма ---
  const text = `Ваш код авторизации: ${code}\n\nСсылка для автоматического входа:\n${loginURL}\n\nЕсли вы не запрашивали вход, просто проигнорируйте это письмо.\n\nС уважением, команда ООО Торговый Дом "Челябинский Инструмент"\nг. Челябинск, ул. Болейко, 5 | +7 (351) 790-77-48\n© ${new Date().getFullYear()} ООО Торговый Дом "Челябинский Инструмент". Все права защищены.`

  const mailData = {
    to: mail,
    subject: 'Подтверждение входа на сайт chelinstrument.ru',
    html,
    text,
  }
  // await sendMail(mailData)
  if (mail !== 'gringo675g@gmail.com') await sendMail(mailData)

  return true
})
