import decodeAndCheckToken from "~/server/src/decodeAndCheckToken";

export default defineEventHandler((event) => {
    // console.log(`from server middleware ifSiteClosed`)
    // console.log(`url: ${JSON.stringify(event.req.url, null, 2)}`)
    if (process.env.IS_SITE_CLOSED !== '1' ) return
    if (event.req.url === '/admin/login' || event.req.url === '/api/auth/login' || event.req.url === '/favicon.ico') return
    // if (event.req.url.startsWith('/__nuxt_error')) return; если раскомментировать, будет обработка ошибки nuxt'ом

    try {
        decodeAndCheckToken(event, { // проверяем, поступил ли запрос от админа
            type: 'refresh',
            adminOnly: true
        })
    } catch (e) { // если нет, завершаем с ошибкой
        console.log(`from catch e: ${JSON.stringify(e, null, 2)}`)
        throw createError({statusCode: 423, statusMessage: `Site temporarily closed. Please try later.`})
    }
})