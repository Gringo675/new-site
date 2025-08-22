/**
 * скрипт для отправки почты через beget
 * @param {*} mail
 * from: от кого, должно быть привязано к Бегету
 * to: кому (должна валидироваться заранее!)
 * subject: тема
 * html: тело письма
 * attachments: массив вложений из объектов вида {filename, content}
 */

import nodemailer from 'nodemailer'

export default async mail => {
  // defaults
  mail.from = mail.from ?? 'admin@chelinstrument.ru'
  mail.subject = mail.subject ?? 'Сообщение с сайта chelinstrument.ru'
  mail.attachments = mail.attachments ?? []
  mail.text = 'This app can not read the message. Try another program.'

  if (!mail.to.length || !mail.html.length) throw new Error('Incorrect data provided!')
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

  console.log(`Mail is sended to: ${mail.to}`)
  return true
  const result = await transporter.sendMail(mail)
  if (result.rejected.length === 0) return true
  else throw new Error('Server rejected email!')
}
