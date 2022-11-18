/*
Из полученного event извлекаем токен, проверяем его, отдаем расшифрованный payload
type - тип токена, 'session' || 'refresh'
 */

import crypto from "crypto";

export default (event, type = 'session') => {

    let token
    if (type === 'session') token = getRequestHeader(event, 'sessionToken')
    else if (type === 'refresh') token = getCookie(event, 'refreshToken')
    else throw createError({statusCode: 500, statusMessage: `Uncorrect token type!`})

    if (!token || token === 'undefined') throw createError({statusCode: 401, statusMessage: `Authentication Required!`})

    const [header, payload, signature] = token.split('.')

    const correctSignature = crypto
        .createHmac('SHA256', process.env.JWT_TOKEN)
        .update(`${header}.${payload}`)
        .digest('base64')
    if (correctSignature !== signature) throw createError({statusCode: 401, statusMessage: `Uncorrect token signature!`})

    // extract data from payload
    const data = JSON.parse(Buffer.from(payload, 'base64').toString('ascii'))

    // проверяем срок действия токена
    if (Date.parse(data.expires) < Date.now()) throw createError({statusCode: 401, statusMessage: `Token outdated!`})

    return data
}