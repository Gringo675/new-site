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
import {callWithNuxt} from '#app'

export default async (url, options = {}) => {

    // defaults
    options.lazy = options.lazy ?? true
    options.auth = options.auth ?? false
    options.server = options.server ?? !options.auth
    options.from = options.from ?? '/'

    console.log(`options.lazy: ${JSON.stringify(options.lazy, null, 2)}`)
    console.log(`options.server: ${JSON.stringify(options.server, null, 2)}`)

    const {value: user} = useUser()
    const nuxtApp = useNuxtApp() // запоминаем "контекст"

    const {data, pending, error} = await useAsyncData(url, async () => {
        try {
            const fetchOptions = {}
            if (options.auth) {
                if (!user.sessionToken || Date.parse(user.sessionExp) - 10e3 < Date.now()) {
                    const isRefresh = await refreshUser()
                    if (!isRefresh) throw createError({statusCode: 456, statusMessage: `Authentication Required!`})
                }
                fetchOptions.headers = {
                    sessionToken: user.sessionToken
                }
            }
            return await $fetch(url, fetchOptions)
        } catch (e) {
            console.log(`from catch`)
            throw createError({statusCode: e.statusCode, statusMessage: e.statusMessage})
            return null
        }
    }, {
        lazy: options.lazy, server: options.server
    })

    const isError = () => {
        if (!error.value) return false
        console.log(`in error`)
        if (error.value.statusCode === 401) callWithNuxt(nuxtApp, navigateTo, ['/user/login?from=' + options.from])
        else callWithNuxt(nuxtApp, showError, [error.value])
        callWithNuxt(nuxtApp, clearNuxtData, [url])
        return true
    }

    const _pending = computed(() => {
        console.log(`from computed`)
        if (pending.value) return true
        return isError()
    })

    return {data, pending: _pending}
}