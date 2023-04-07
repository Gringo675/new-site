/**
 * модуль-заглушка, закрывающий доступ пользователям (пропускает только админов)
 */
export default defineEventHandler(async (event) => {

    // const {tokenType} = getQuery(event)

    decodeAndCheckToken(event, {
        // type: tokenType,
        adminOnly: true
    })

    return true
})