export default defineNuxtPlugin( nuxtApp => {
    if (process.client) return
    console.log(`from plugin`)
    // console.log(`process: ${JSON.stringify(process, null, 2)}`)
    // throw createError({ statusCode: 423, statusMessage: `Site closed`})
    if (process.env.IS_SITE_CLOSED === '1') throw createError({ statusCode: 423, statusMessage: `Site closed`})
})