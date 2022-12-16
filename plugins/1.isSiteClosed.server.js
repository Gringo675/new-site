export default defineNuxtPlugin(async nuxtApp => {
    // console.log(`from runtime server plugin`)
    // if (process.env.IS_SITE_CLOSED === '1') {
    //     const headers = useRequestHeaders(['cookie'])
    //     try {
    //         await $fetch('/api/user/isAdmin?tokenType=refresh', {headers}) // пропускаем только админов
    //     } catch (e) {
    //         throw createError({statusCode: 423, statusMessage: `Site closed`})
    //     }
    // }
})