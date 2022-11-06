
export default defineEventHandler(async (event) => {

    // await timer(3)

    const cTime = new Date().toLocaleTimeString()

    console.log(`from apiTest: ${cTime}`)

    // const error = new Error(`error from throw Error`)
    // error.statusCode = 402
    // throw error

    // throw createError({ statusCode: 511, statusMessage: `Network Authentication Required in ${cTime}`})
    throw createError({ statusCode: 498, statusMessage: `Some error in ${cTime}`})
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