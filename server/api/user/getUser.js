import request from "~/server/src/mysql"
import crypto from "crypto";


export default defineEventHandler(async (event) => {
    // по sessionToken получаем информацию о пользователе

    const token = getRequestHeader(event, 'sessionToken')
    // console.log(`user token: ${JSON.stringify(token, null, 2)}`)
    if (!token || token === 'undefined') return {status: 'no auth'}

    const [header, payload, signature] = token.split('.') // вынести в composable

    const correctSignature = crypto
        .createHmac('SHA256', process.env.JWT_TOKEN)
        .update(`${header}.${payload}`)
        .digest('base64')
    if (correctSignature !== signature) return {status: 'uncorrect signature'}

    // extract user data from payload
    let user = JSON.parse(Buffer.from(payload, 'base64').toString('ascii'))
    // console.log(`user: ${JSON.stringify(user, null, 2)}`)
    // проверяем срок действия токена
    if (Date.parse(user.expires) < Date.now()) return {status: 'token outdated'}
    // получаем user'a
    const query = `SELECT *
                   FROM i_users WHERE id = ${user.id} LIMIT 1`;
    // console.log(`query: ${query}`);
    user = (await request(query))[0]
    if (!user) return {status: 'no such user'}

    return {
        status: 'ok',
        name: user.name,
        isAdmin: !!user.admin,
        cart: user.cart,
    }
})