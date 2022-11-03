/*
Для полученного user'a создаем refresh && session tokens.
Для установки cookie также необходимо передать event
 */

import crypto from 'crypto'
import request from "~/server/src/mysql"

export default (user, event) => {

    // создаем refresh token и записываем его в cookie
    const refreshExp = new Date(Date.now() + 7776e6) // + 90 days
    const refreshHead = Buffer.from(JSON.stringify({alg: 'HS256', typ: 'jwt'})).toString('base64')
    const refreshPayload = Buffer.from(JSON.stringify({userId: user.id, expires: refreshExp})).toString('base64')
    const refreshSignature = crypto
        .createHmac('SHA256', process.env.JWT_TOKEN)
        .update(`${refreshHead}.${refreshPayload}`)
        .digest('base64')
    setCookie(event, 'refreshToken', `${refreshHead}.${refreshPayload}.${refreshSignature}`, {
        path: '/api/auth', expires: refreshExp, httpOnly: true, secure: true, sameSite: 'strict'
    })

    // создаем session token
    const sessionExp = new Date(Date.now() + 18e5) // + 30 min
    const sessionHead = Buffer.from(JSON.stringify({alg: 'HS256', typ: 'jwt'})).toString('base64')
    const sessionPayload = Buffer.from(JSON.stringify({id: user.id, isAdmin: !!user.admin, expires: sessionExp})).toString('base64')
    const sessionSignature = crypto
        .createHmac('SHA256', process.env.JWT_TOKEN)
        .update(`${sessionHead}.${sessionPayload}`)
        .digest('base64')

    // записываем в базу время обновления
    const query = `UPDATE i_users SET last_refresh = '${new Date().toISOString()}' WHERE id = ${user.id}`;
    request(query)

    return {
        refreshToken: `${refreshHead}.${refreshPayload}.${refreshSignature}`,
        sessionToken: `${sessionHead}.${sessionPayload}.${sessionSignature}`,
        sessionExp
    }
}