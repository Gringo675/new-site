/*
composable универсальный fetch с поддержкой авторизации и обработкой ошибок
url - адрес api русурса
options {
    lazy
    auth
    from - относительный путь страницы, откуда отправляем запрос. Используется для переадресации при неудачном запросе.
}

 */

import useUser from "~/composables/user/useUser"
import refreshUser from "~/composables/user/refreshUser"

export default async (url, options = {}) => {

    // defaults
    options.lazy = options.lazy ?? true
    options.auth = options.auth ?? false
    options.server = options.server ?? !options.auth
    options.from = options.from ?? '/'

    const {value: user} = useUser()

    // очищаем неудачный fetch для последующих заходов на страницу (lifehooks должны идти до первого await)
    onUnmounted(() => {
        if (data.value === null) clearNuxtData(url) // без await, иначе некорректно очищает
    })

    const {data, pending, error} = await useAsyncData(url, async () => {
        try {
            const fetchOptions = {}
            if (options.auth) {
                if (!user.sessionToken || Date.parse(user.sessionExp) - 10e3 < Date.now()) {
                    const isRefresh = await refreshUser()
                    if (!isRefresh) throw createError({
                        statusCode: 511, statusMessage: `Network Authentication Required!`
                    })
                }
                fetchOptions.headers = {
                    sessionToken: user.sessionToken
                }
            }
            return await $fetch(url, fetchOptions)
        } catch (e) {
            throw createError({statusCode: e.statusCode, statusMessage: e.statusMessage, fatal: true})
            return null
        }
    }, {
        lazy: options.lazy, server: options.server
    })

    // watchEffect(() => { // следим за ошибками
    //     if (!error.value) return
    //     console.log(`watchEffect error: ${JSON.stringify(error.value, null, 2)}`)
    //     if (error.value.statusCode === 511) {
    //         console.log(`auth redirect`)
    //         navigateTo('/user/login?from=' + options.from)
    //     }
    //     else showError(error.value)
    //     // else throw createError({ statusCode: 498, statusMessage: `Some error in 000}`})
    // })
    const handleError = (error) => {
        if (error.statusCode === 511) navigateTo('/user/login?from=' + options.from)
            // else throw createError(error)
        // throw createError({ statusCode: 498, statusMessage: `Some error in 000}`})
        else showError(error)
    }
    watch(() => error.value, () => { // на клиенте
        console.log(`watch error: ${JSON.stringify(error.value, null, 2)}`)
        handleError(error.value)
    })
    if (process.server && error.value) { // на сервере
        console.log(`if error: ${JSON.stringify(error.value, null, 2)}`)
        handleError(error.value)
        // throw createError({ statusCode: error.value.statusCode, statusMessage: error.value.statusMessage, fatal: false })
    }


// очищаем неудачный fetch для последующих заходов на страницу
//     const unwatch = watch(pending, async () => {
//         if (pending.value) return // т.к. сначала будет true при втором заходе на страницу
//         unwatch() // only once
//         if (data.value === null) clearNuxtData(url)
//     })

    return {data, pending, error}
}