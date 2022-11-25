import request from "~/server/src/mysql"
import decodeAndCheckToken from "~/server/src/decodeAndCheckToken";


export default defineEventHandler(async (event) => {
    // по sessionToken получаем информацию о пользователе

    const tokenUser = decodeAndCheckToken(event)

    // получаем user'a
    const query = `SELECT *
                   FROM i_users WHERE id = ${tokenUser.id} LIMIT 1`;
    // console.log(`query: ${query}`);
    const user = (await request(query))[0]
    if (!user) throw createError({statusCode: 401, statusMessage: `User not found!`})

    return {
        name: user.name,
        isAdmin: !!user.admin,
        cart: user.cart,
    }
})