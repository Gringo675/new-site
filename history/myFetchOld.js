/*
composable универсальный fetch с поддержкой авторизации и обработкой ошибок
url - адрес api русурса
options {
    lazy
    auth
    server
    from - относительный путь страницы, откуда отправляем запрос. Используется для переадресации при неудачном запросе.
}
 */

import useUser from "~/composables/user/useUser"
import refreshUser from "~/composables/user/refreshUser"
import { callWithNuxt } from '#app'

export default async (url, options = {}) => {

    // defaults
    options.lazy = options.lazy ?? true
    options.auth = options.auth ?? false
    options.server = options.server ?? !options.auth
    options.from = options.from ?? '/'

    const {value: user} = useUser()
    const nuxtApp = useNuxtApp() // запоминаем "контекст"

    // очищаем для последующих заходов на страницу (lifehooks должны идти до первого await)
    onUnmounted(() => {
        unwatch() // иначе будет добавляться по обработчику при каждом заходе
        if (error.value) callWithNuxt(nuxtApp, clearNuxtData, [url])
    })

    const {data, pending, error} = await useAsyncData(url, async () => {
        try {
            const fetchOptions = {}
            if (options.auth) {
                if (!user.sessionToken || Date.parse(user.sessionExp) - 10e3 < Date.now()) {
                    const isRefresh = await refreshUser()
                    if (!isRefresh) throw createError({
                        statusCode: 401, statusMessage: `Authentication Required!`
                    })
                }
                fetchOptions.headers = {
                    sessionToken: user.sessionToken
                }
            }
            return await $fetch(url, fetchOptions)
        } catch (e) {
            throw createError({statusCode: e.statusCode, statusMessage: e.statusMessage})
            return null
        }
    }, {
        lazy: options.lazy, server: options.server
    })

    const unwatch = watchEffect(() => { // следим за ошибками
        if (!error.value) return
        console.log(`from watch error`)
        if (error.value.statusCode === 401) callWithNuxt(nuxtApp, navigateTo, ['/user/login?from=' + options.from])
        else callWithNuxt(nuxtApp, showError, [error.value])
    })

    return {data, pending, error}
}