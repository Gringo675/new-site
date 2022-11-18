import request from "~/server/src/mysql"
import createTokens from "~/server/src/createTokens"


export default defineEventHandler(async (event) => {

    const {mail, pass} = await readBody(event)
    if (!mail || !pass)  throw createError({statusCode: 400, statusMessage: `Bad request!`})

    const query = `SELECT id, admin, pass
                   FROM i_users WHERE mail = '${mail}' LIMIT 1`;
    const user = (await request(query))[0]
    if (!user) throw createError({statusCode: 401, statusMessage: `User not found!`})

    if (user.pass !== pass) throw createError({statusCode: 401, statusMessage: `Uncorrect password!`})

    const { sessionToken, sessionExp } = createTokens(user, event)


    return {
        sessionToken,
        sessionExp
    }

})