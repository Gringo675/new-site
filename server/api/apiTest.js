import decodeAndCheckToken from "~/server/src/decodeAndCheckToken"

export default defineEventHandler(async (event) => {
    const cTime = new Date().toLocaleTimeString()
    console.log(`from apiTest: ${cTime}`)
    await timer(2)

    // const token = getRequestHeader(event, 'sessionToken')
    // // console.log(`user token: ${JSON.stringify(token, null, 2)}`)
    // if (!token || token === 'undefined') throw createError({ statusCode: 511, statusMessage: `Network Authentication Required!`})

    // const error = new Error(`error from throw Error`)
    // error.statusCode = 402
    // throw error

    throw createError({ statusCode: 457, statusMessage: `Error in ${cTime}`})
    // throw createError({ statusCode: 499, statusMessage: `Some error in ${cTime}`})
    // showError({ statusCode: 404, statusMessage: 'Page Not Found!!!!'})

    // return `Current Time -  ${cTime}`
    return {
        'Current time': cTime,
        aaa: [111, 222, 333]
    }

})

async function timer(sec) {
    let promise = new Promise((resolve, reject) => {
        setTimeout(() => resolve(), sec * 1000)
    });
    return await promise;
}