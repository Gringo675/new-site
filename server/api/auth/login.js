import request from "~/server/src/mysql"
import createTokens from "~/server/src/createTokens"
import cv from "~/server/src/cv";

export default defineEventHandler(async (event) => {

    cv('from login')
    const {mail, pass} = await readBody(event)
    cv({mail}, {pass})
    if (!mail || !pass) throw createError({statusCode: 400, statusMessage: `Bad request!`})

    const query = `SELECT id, admin, pass
                   FROM i_users WHERE mail = '${mail}' LIMIT 1`;
    const user = (await request(query))[0]
    cv({user})
    if (!user) throw createError({statusCode: 401, statusMessage: `User not found!`})

    if (user.pass !== pass) throw createError({statusCode: 401, statusMessage: `Uncorrected password!`})

    const {sessionToken, sessionExp} = createTokens(user, event)


    return {
        sessionToken,
        sessionExp
    }

})