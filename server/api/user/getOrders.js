export default defineEventHandler(async (event) => {

    const tokenUser = decodeAndCheckToken(event)



    return `orders for user with id = ${tokenUser.id} received`
})