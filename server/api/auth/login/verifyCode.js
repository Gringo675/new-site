export default defineEventHandler(async (event) => {

    const { mail, code } = await readBody(event)

    if (!validateMail(mail)) throw createError({ statusCode: 400, statusMessage: `Incorrect mail format!` })
    if (isNaN(code) || code.length !== 5) throw createError({ statusCode: 400, statusMessage: `Incorrect code format!` })

    let query = `SELECT id, ver_code, admin FROM i_users WHERE mail = '${mail}' LIMIT 1`
    const user = (await dbReq(query))[0]
    if (!user) throw createError({ statusCode: 400, statusMessage: `Bad request!` })
    if (user.ver_code < 100000 || user.ver_code > 999999) throw createError({ statusCode: 400, statusMessage: `Bad request!` })

    // разбиваем ver_code на код и число оставшихся попыток
    user.attemptsLeft = 10 - user.ver_code % 10
    user.code = Math.floor(user.ver_code / 10)
    if (user.code !== Number(code)) {
        user.attemptsLeft--
        const newVerCode = user.attemptsLeft > 0 ? ++user.ver_code : 377
        const query = `UPDATE i_users SET ver_code = ${newVerCode} WHERE id = ${user.id}`
        await dbReq(query)
        return {
            isError: true,
            message: `Неверный код!`,
            attemptsLeft: user.attemptsLeft
        }
    }

    query = `UPDATE i_users SET ver_code = 0 WHERE id = ${user.id}`
    await dbReq(query)

    const { sessionToken, sessionExp } = createTokens(user, event)

    return {
        sessionToken,
        sessionExp
    }
})

