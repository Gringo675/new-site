/*
Из полученного event извлекаем токен, проверяем его, отдаем расшифрованный user
options {
    type - тип токена, 'session' || 'refresh'
    adminOnly - дополнительная проверка на user = isAdmin
}
 */

import crypto from "crypto";

export default (event, options = {}) => {

    // defaults
    options.type = options.type ?? 'session'
    options.adminOnly = options.adminOnly ?? false

    let token
    if (options.type === 'session') token = getRequestHeader(event, 'sessionToken')
    else if (options.type === 'refresh') token = getCookie(event, 'refreshToken')
    else throw createError({statusCode: 500, statusMessage: `Uncorrect token type!`})

    if (!token || token === 'undefined') throw createError({statusCode: 401, statusMessage: `Authentication Required!`})

    const [header, payload, signature] = token.split('.')

    const correctSignature = crypto
        .createHmac('SHA256', process.env.JWT_TOKEN)
        .update(`${header}.${payload}`)
        .digest('base64')
    if (correctSignature !== signature) throw createError({statusCode: 503, statusMessage: `Uncorrect token signature!`})

    // extract data from payload
    const user = JSON.parse(Buffer.from(payload, 'base64').toString('ascii'))

    // проверяем срок действия токена
    if (Date.parse(user.expires) < Date.now()) throw createError({statusCode: 401, statusMessage: `Token outdated!`})

    // проверяем isAdmin
    if (options.adminOnly && !user.isAdmin) throw createError({statusCode: 403, statusMessage: `Forbidden!`})

    return user
}