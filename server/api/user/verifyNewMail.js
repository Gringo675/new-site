/**
 * Функция получает новый почтовый адрес, отправляет на него письмо с сгенерированным кодом
 * и возвращает хеш данного кода
 */

import { createHash } from 'node:crypto'

export default defineEventHandler(async event => {
  await checkToken(event)
  const { mail } = await readBody(event)
  if (!validateMail(mail)) throw createError({ statusCode: 400, statusMessage: `Incorrect mail format!` })

  // проверяем на отсутствие в базе (уникальность)
  const query = `SELECT id FROM i_users WHERE mail = '${mail}' LIMIT 1`
  if ((await dbReq(query))[0]) return { error: true, message: 'Почтовый адрес уже принадлежит другому пользователю!' }

  const code = getRandomCode().toString()
  // const code = '11111'
  const hashCode = createHash('sha256').update(code).digest('hex')

  const mailData = {
    to: mail,
    subject: 'Подтверждение изменения почты сайт chelinstrument.ru',
    html: `<div>
              <h2>Для изменения почтового адреса Вашего аккаунта введите следующий код:</h2>
              <div style="font-size: 20px"> ${code} </div>
          </div>`,
  }
  await sendMail(mailData)

  return hashCode
})
