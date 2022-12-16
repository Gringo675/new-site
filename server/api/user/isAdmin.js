/**
 * модуль-заглушка, закрывающий доступ пользователям (пропускает только админов)
 */
import decodeAndCheckToken from "~/server/src/decodeAndCheckToken";

export default defineEventHandler(async (event) => {

    // const {tokenType} = getQuery(event)

    decodeAndCheckToken(event, {
        // type: tokenType,
        adminOnly: true
    })

    return true
})