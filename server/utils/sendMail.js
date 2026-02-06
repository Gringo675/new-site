/**
 * скрипт для отправки почты через beget
 * @param {*} mail
 * to: кому (должна валидироваться заранее!)
 * subject: тема
 * html: тело письма
 * text: текстовая версия письма
 * attachments: массив вложений из объектов вида {filename, content}
 */

import nodemailer from 'nodemailer'

export default async mail => {
  //
  if (!mail.to.length || !mail.html.length) throw new Error('Incorrect data provided!')
  // can't change 'from' without changing auth user/pass
  mail.from = '"ТД Челябинский Инструмент" <info@chelinstrument.ru>'
  // defaults
  mail.subject = mail.subject ?? 'Сообщение с сайта chelinstrument.ru'
  mail.attachments = mail.attachments ?? []
  mail.text = mail.text ?? 'Для просмотра этого письма необходимо использовать почтовый клиент с поддержкой HTML.'

  const config = useRuntimeConfig()

  const transporter = nodemailer.createTransport({
    host: config.MAIL_HOST,
    port: config.MAIL_PORT,
    secure: true,
    auth: {
      user: config.MAIL_USER,
      pass: config.MAIL_PASS,
    },
  })

  const result = await transporter.sendMail(mail)
  if (result.rejected.length === 0) return true
  else throw new Error('Server rejected email!')
}
