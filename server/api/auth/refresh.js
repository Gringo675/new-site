import request from "~/server/src/mysql"
import crypto from 'crypto'
import createTokens from "~/server/src/createTokens";

export default defineEventHandler(async (event) => {
    const token = getCookie(event, 'refreshToken')
    if (!token) return {status: 'not found'}

    const [header, payload, signature] = token.split('.')

    const correctSignature = crypto
        .createHmac('SHA256', process.env.JWT_TOKEN)
        .update(`${header}.${payload}`)
        .digest('base64')
    if (correctSignature !== signature) return {status: 'uncorrect signature'}

    // extract user data from payload
    let user = JSON.parse(Buffer.from(payload, 'base64').toString('ascii'))

    // проверяем срок действия токена
    if (Date.parse(user.expires) < Date.now()) return {status: 'token outdated'}
    // получаем user'a
    const query = `SELECT *
                   FROM i_users WHERE id = ${user.userId} LIMIT 1`;
    user = (await request(query))[0]
    if (!user) return {status: 'no such user'}
    // обновляем токены
    const { refreshToken, sessionToken, sessionExp } = createTokens(user, event)

    return {
        status: 'ok',
        refreshToken,
        sessionToken,
        sessionExp
    }

})