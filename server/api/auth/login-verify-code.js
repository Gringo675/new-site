export default defineEventHandler(async (event) => {

    try {
        const { mail, code } = await readBody(event)
        throw createError({ statusCode: 429, statusMessage: `Some error!` })
        if (!mail || !code) throw createError({ statusCode: 400, statusMessage: `Bad request!` })

        let query = `SELECT id, ver_code, admin FROM i_users WHERE mail = '${mail}' LIMIT 1`
        const user = (await request(query))[0]
        if (user.ver_code !== code) throw createError({ statusCode: 433, statusMessage: `Code incorrect!` })

        query = `UPDATE i_users SET ver_code = 0 WHERE id = ${user.id}`
        await request(query)

        const { sessionToken, sessionExp } = createTokens(user, event)

        return {
            sessionToken,
            sessionExp
        }
    } catch (e) {
        cv({e})
        if (e.statusCode === 433) return { isError: true }
        else throw createError({ statusCode: e.statusCode, statusMessage: e.statusMessage })
    }


})

