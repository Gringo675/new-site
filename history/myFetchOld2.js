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
    options.transform = (data) => {
        console.log(`transform data: ${JSON.stringify(data, null, 2)}`)
        return data
    }

    const {value: user} = useUser()
    const nuxtApp = useNuxtApp()

    // очищаем для последующих заходов на страницу (lifehooks должны идти до первого await)
    onUnmounted(() => {
        if (unwatch) unwatch() // иначе будет добавляться по обработчику при каждом заходе, почему-то не удаляются автоматически
    })

    const {data, pending, error} = await useAsyncData(url, async () => {
        console.log(`from useAsyncData`)
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
            return $fetch(url, fetchOptions)
        } catch (e) {
            throw createError({statusCode: e.statusCode, statusMessage: e.statusMessage})
            return null
        }
    }, {
        lazy: options.lazy, server: options.server, transform: options.transform
    })

    const _calculatePending = () => {
        console.log(`from _calculatePending`)
        // нужно учесть, что при повторном заходе начальное значение pending будет false,
        // даже если данные еще не получены (предыдущий заход завершился ошибкой)
        if (!pending.value && data.value) return false
        if (error.value) handleError(error.value, url, nuxtApp)
        return true
    }

    const _pending = ref(_calculatePending())

    let unwatch
    if (process.client && _pending.value) { // если запрос не разрешился синхронно, вешаем watcher
        console.log(`from active pending`)
        unwatch = watch(() => pending.value, () => {
            console.log(`from watch`)
            _pending.value = _calculatePending()
        })
    }

    return {data, pending: _pending}
}

const handleError = (error, url, nuxtApp) => {
    console.log(`from handleError`)
    // const nuxtApp = useNuxtApp()
    if (error.statusCode === 401) callWithNuxt(nuxtApp, navigateTo, ['/user/login?from=' + options.from])
    else callWithNuxt(nuxtApp, showError, [error])
    callWithNuxt(nuxtApp, clearNuxtData, [url])
}