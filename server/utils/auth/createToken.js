/*
Для полученного user'a создаем token.
Для установки cookie также необходимо передать event
 */

import crypto from 'crypto'

const config = useRuntimeConfig()
const tokenKey = config.JWT_TOKEN_KEY
const tokenLifeTime = Number(config.JWT_TOKEN_LIFETIME)

export default (user, event) => {
  const tokenExp = new Date(Date.now() + tokenLifeTime)
  const tokenHead = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'jwt' })).toString('base64')
  const tokenPayload = Buffer.from(
    JSON.stringify({
      id: user.id,
      admin: !!user.admin,
      expires: tokenExp,
    })
  ).toString('base64')
  const tokenSignature = crypto.createHmac('SHA256', tokenKey).update(`${tokenHead}.${tokenPayload}`).digest('base64')

  setCookie(event, 'token', `${tokenHead}.${tokenPayload}.${tokenSignature}`, {
    path: '/',
    expires: tokenExp,
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
  })
}
