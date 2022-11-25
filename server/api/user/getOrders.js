import decodeAndCheckToken from "~/server/src/decodeAndCheckToken";
import useTimer from "~/server/src/useTimer"

export default defineEventHandler(async (event) => {
    await useTimer(2)
    const tokenUser = decodeAndCheckToken(event)



    return `orders for user with id = ${tokenUser.id} received`
})