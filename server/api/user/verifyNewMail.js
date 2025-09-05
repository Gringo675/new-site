/**
 * Функция получает новый почтовый адрес, отправляет на него письмо с сгенерированным кодом
 * и возвращает хеш данного кода
 */

import { createHash } from 'node:crypto'
// Для загрузки шаблона
let cachedVerifyMailTemplate = null

export default defineEventHandler(async event => {
  await checkToken(event)
  const { mail } = await readBody(event)
  if (!validateMail(mail)) throw createError({ statusCode: 400, statusMessage: `Incorrect mail format!` })

  // проверяем на отсутствие в базе (уникальность)
  const query = `SELECT id FROM i_users WHERE mail = '${mail}' LIMIT 1`
  if ((await dbReq(query))[0]) return { error: true, message: 'Почтовый адрес уже принадлежит другому пользователю!' }

  const code = getRandomCode().toString()
  const hashCode = createHash('sha256').update(code).digest('hex')

  // --- Загрузка и кэширование шаблона ---
  if (process.env.NODE_ENV === 'development' || !cachedVerifyMailTemplate) {
    const storage = useStorage('assets:server')
    const tpl = await storage.getItem('emails/verifyNewMailTemplate.html')
    if (!tpl) throw new Error('Не удалось загрузить шаблон письма подтверждения почты.')
    cachedVerifyMailTemplate = tpl
  }

  // --- Подстановка переменных ---
  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\\\]]/g, '\\$&')
  }
  const replacements = {
    '{{code}}': code,
    '{{currentYear}}': String(new Date().getFullYear()),
  }
  let html = cachedVerifyMailTemplate
  for (const [key, value] of Object.entries(replacements)) {
    const escapedKey = escapeRegExp(key)
    html = html.replace(new RegExp(escapedKey, 'g'), String(value))
  }

  // --- Текстовая версия письма ---
  const text = `Для изменения почтового адреса Вашего аккаунта введите следующий код:\n\n${code}\n\nЕсли вы не запрашивали изменение почты, просто проигнорируйте это письмо.\n\nС уважением, команда ООО Торговый Дом "Челябинский Инструмент"\nг. Челябинск, ул. Болейко, 5 | +7 (351) 790-77-48\n© ${new Date().getFullYear()} ООО Торговый Дом "Челябинский Инструмент". Все права защищены.`

  const mailData = {
    to: mail,
    subject: 'Подтверждение изменения почты сайт chelinstrument.ru',
    html,
    text,
  }
  await sendMail(mailData)

  return hashCode
})
