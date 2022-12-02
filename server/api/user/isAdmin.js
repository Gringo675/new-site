/**
 * модуль-заглушка, закрывающий доступ пользователям (пропускает только админов)
 */
import decodeAndCheckToken from "~/server/src/decodeAndCheckToken";

export default defineEventHandler(async (event) => {
    console.log(`from isAdmin`)

    decodeAndCheckToken(event, {adminOnly: true})

    return true
})