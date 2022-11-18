import request from "~/server/src/mysql"
import createTokens from "~/server/src/createTokens";
import decodeAndCheckToken from "~/server/src/decodeAndCheckToken";

export default defineEventHandler(async (event) => {

    const tokenUser = decodeAndCheckToken(event, 'refresh')

    // получаем user'a
    const query = `SELECT id, admin
                   FROM i_users WHERE id = ${tokenUser.userId} LIMIT 1`;
    const user = (await request(query))[0]
    if (!user) throw createError({statusCode: 401, statusMessage: `User not found!`})

    // обновляем токены
    const { refreshToken, sessionToken, sessionExp } = createTokens(user, event)

    return {
        refreshToken,
        sessionToken,
        sessionExp
    }

})