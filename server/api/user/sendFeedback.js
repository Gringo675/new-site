/**
 * Получает formData c полями: user, message, files, subject = 'Сообщение с сайта - Обратная связь'
 */

export default defineEventHandler(async event => {
  //
  const fbData = await getFormData(event)
  fbData.subject = fbData.subject ?? 'Сообщение с сайта - Обратная связь'

  await sendFb(fbData)

  return true
})

const sendFb = async fbData => {
  const mailData = {
    to: 'admin@chelinstrument.ru',
    subject: fbData.subject,
    attachments: fbData.files,
  }
  mailData.html = `
  <h2>Контактные данные:</h2>
  <div>
  <p>Имя - ${fbData.user.name}</p>
    <p>Почта - ${fbData.user.mail}</p>
    <p>Имя - ${fbData.user.org}</p>
    <p>ИНН - ${fbData.user.inn}</p>
    <p>Адрес - ${fbData.user.address}</p>
    <p>Телефон - ${fbData.user.phone}</p>
  </div>
  <h2>Сообщение:</h2>
  <pre>${fbData.message}</pre>
  `

  await sendMail(mailData)
}
