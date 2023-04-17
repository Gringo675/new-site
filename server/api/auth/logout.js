// используется для удаления cookie (refreshToken), т.к. из-за httpOnly на клиенте через js это сделать нельзя

export default defineEventHandler(async (event) => {

    setCookie(event, 'refreshToken', '', {
        path: '/', expires: new Date('Thu, 01 Jan 1970 00:00:00 GMT'), httpOnly: true, secure: true, sameSite: 'strict'
    })

    return 'ok' // если ничего не возвращать, будет 404

})