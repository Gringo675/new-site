/*
Из полученного event извлекаем токен, проверяем его, отдаем расшифрованный user
options {
    adminOnly - дополнительная проверка на user = admin
}
 */

import crypto from 'crypto'

const config = useRuntimeConfig()
const tokenKey = config.JWT_TOKEN_KEY
const tokenLifeTime = Number(config.JWT_TOKEN_LIFETIME)

export default async (event, options = {}) => {
  // defaults
  options.adminOnly = options.adminOnly ?? false

  const token = getCookie(event, 'token')
  if (!token || token === 'undefined')
    throw createError({
      statusCode: 401,
      statusMessage: `Authentication Required!`,
    })

  const [header, payload, signature] = token.split('.')

  const correctSignature = crypto.createHmac('SHA256', tokenKey).update(`${header}.${payload}`).digest('base64')
  if (correctSignature !== signature) {
    deleteToken(event)
    throw createError({
      statusCode: 503,
      statusMessage: `Incorrect token signature!`,
    })
  }

  // extract data from payload
  const user = JSON.parse(Buffer.from(payload, 'base64').toString('ascii'))
  const tokenRemainingTime = Date.parse(user.expires) - Date.now()

  // проверяем срок действия токена
  if (tokenRemainingTime < 0) throw createError({ statusCode: 401, statusMessage: `Token outdated!` })

  // проверяем isAdmin
  if (options.adminOnly && !user.admin) throw createError({ statusCode: 403, statusMessage: `Forbidden!` })

  // обновляем токен, если прошло больше 30 мин с его создания
  if (tokenLifeTime - tokenRemainingTime > 18e5) await refreshToken(user, event)

  return user
}
