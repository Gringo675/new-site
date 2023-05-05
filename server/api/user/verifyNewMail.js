/**
 * Функция получает новый почтовый адрес, отправляет на него письмо с сгенерированным кодом
 * и возвращает хеш данного кода
 */

import { createHash } from 'node:crypto'

export default defineEventHandler(async event => {
  await checkToken(event)
  const { mail } = await readBody(event)
  if (!validateMail(mail)) throw createError({ statusCode: 400, statusMessage: `Incorrect mail format!` })

  const code = getRandomCode().toString()
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
