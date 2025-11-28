import crypto from 'crypto'

const config = useRuntimeConfig()
const tokenKey = config.JWT_TOKEN_KEY
const tokenLifeTime = Number(config.JWT_TOKEN_LIFETIME)

const getBaseCookieOptions = () => {
  const options = {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
  }

  if (process.env.NODE_ENV === 'production') {
    options.secure = true
  }
  return options
}

export const createToken = (user, event) => {
  const tokenExp = new Date(Date.now() + tokenLifeTime)
  const tokenHead = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'jwt' })).toString('base64')
  const tokenPayload = Buffer.from(
    JSON.stringify({
      id: user.id,
      admin: !!user.admin,
      expires: tokenExp,
    }),
  ).toString('base64')
  const tokenSignature = crypto.createHmac('SHA256', tokenKey).update(`${tokenHead}.${tokenPayload}`).digest('base64')

  const cookieOptions = {
    ...getBaseCookieOptions(),
    expires: tokenExp,
  }

  setCookie(event, 'token', `${tokenHead}.${tokenPayload}.${tokenSignature}`, cookieOptions)

  // записываем в базу время обновления
  const query = `UPDATE i_users
                   SET last_refresh = '${new Date().toISOString()}'
                   WHERE id = ${user.id}`
  dbReq(query)
}

export const deleteToken = event => {
  const cookieOptions = {
    ...getBaseCookieOptions(),
    expires: new Date('Thu, 01 Jan 1970 00:00:00 GMT'),
  }

  setCookie(event, 'token', '', cookieOptions)
}

export const refreshToken = async (tokenUser, event) => {
  const query = `SELECT id, admin
                   FROM i_users WHERE id = ${tokenUser.id} LIMIT 1`
  const user = (await dbReq(query))[0]
  if (!user) throw createError({ statusCode: 401, statusMessage: `User not found!` })

  createToken(user, event)
}

export const checkToken = async (event, options = {}) => {
  // defaults
  options.adminOnly = options.adminOnly ?? false

  const token = getCookie(event, 'token')
  if (!token || token === 'undefined') {
    throw createError({
      statusCode: 401,
      statusMessage: `Authentication Required!`,
    })
  }

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
