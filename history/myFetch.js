/*
получение данных через $fetch с поддержкой авторизации и обработкой ошибок
использовать только на клиенте!
url - адрес api ресурса
options {
    auth - истользовать с аутентификацией
    silent - не показывать loader и не обрабатывать ошибки
    method - get || post,
    payload - данные для передачи с post,
}
 */

import useUser from "~/composables/user/useUser"
import refreshUser from "~/composables/user/refreshUser"
import loader from "~/composables/common/loader"

export default async (url, options = {}) => {

    if (process.server) throw createError({statusCode: 511, statusMessage: `myFetch should be used only on client side!`})

    // defaults
    options.auth = options.auth ?? false
    options.method = options.method ?? 'get'
    options.payload = options.payload ?? ''
    options.silentError = options.silentError ?? false

    const {value: user} = useUser()


    const fetchOptions = {}

    if (options.auth) {
        if (!user.sessionToken || Date.parse(user.sessionExp) - 10e3 < Date.now()) {
            const isRefresh = await refreshUser()
            if (!isRefresh) {
                // throw createError({statusCode: 401, statusMessage: `Authentication Required!`})
                showError({statusCode: 401, statusMessage: `Authentication Required!`})
                return null
            }
        }
        fetchOptions.headers = {
            sessionToken: user.sessionToken
        }
    }

    if (options.method === 'post') {
        fetchOptions.method = 'post'
        fetchOptions.body = options.payload
    }

    if (!options.silent) loader.show()
    let result = null
    while (true) {
        try {
            result = await $fetch(url, fetchOptions)
            break
        } catch (e) {
            console.error(`Fetch error! ${e.statusCode}: ${e.statusMessage}`)
            if (options.silent) break
            if (e.statusCode === 401 || e.statusCode === 403) {
                showError(e)
                break
            }
            else {
                const repeat = confirm(`Ошибка при обращении к ${url}!\nError ${e.statusCode}: ${e.statusMessage}\nПовторить запрос?`)
                if (!repeat) break
            }
        }
    }
    if (!options.silent) loader.hide()
    return result
 }
