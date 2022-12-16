import decodeAndCheckToken from "~/server/src/decodeAndCheckToken";

export default defineEventHandler((event) => {
    console.log(`from server middleware ifSiteClosed`)
    console.log(`url: ${JSON.stringify(event.req.url, null, 2)}`)
    // todo проверить url на хостинге, будет он относительным или полным
    if (process.env.IS_SITE_CLOSED !== '1' ) return
    if (event.req.url === '/admin/login' || event.req.url === '/api/auth/login' || event.req.url === '/favicon.ico') return
    if (event.req.url.startsWith('/__nuxt_error')) return;

    try {
        decodeAndCheckToken(event, { // проверяем, поступил ли запрос от админа
            type: 'refresh',
            adminOnly: true
        })
    } catch (e) { // если нет, завершаем с ошибкой
        throw createError({statusCode: 423, statusMessage: `Site temporarily closed. Please try later.`})
    }
})