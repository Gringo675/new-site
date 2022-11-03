import request from "~/server/src/mysql"
import createTokens from "~/server/src/createTokens"


export default defineEventHandler(async (event) => {

    // try {
    const {mail, pass} = await readBody(event)

    const query = `SELECT *
                   FROM i_users WHERE mail = '${mail}' LIMIT 1`;
    const user = (await request(query))[0]

    if (user.pass !== pass) throw new Error()

    const { refreshToken, sessionToken, sessionExp } = createTokens(user, event)


    return {
        status: 'ok',
        name: user.name,
        isAdmin: !!user.admin,
        cart: user.cart,
        refreshToken,
        sessionToken,
        sessionExp
    }

    // } catch (e) {
    //     return {
    //         status: 'error'
    //     }
    // }


})