import request from "~/server/src/mysql";

export default defineEventHandler(async (event) => {

    await timer(3)

    const cTime = new Date().toLocaleTimeString()

    console.log(`from apiTest: ${cTime}`)

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