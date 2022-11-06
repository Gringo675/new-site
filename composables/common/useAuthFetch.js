/*
composable для запросов с авторизацией. Выполняется только на клиенте.
url - адрес api русурса
from - относительный путь страницы, откуда отправляем запрос. Используется для переадресации при неудачном запросе.
 */

import useUser from "~/composables/user/useUser"
import refreshUser from "~/composables/user/refreshUser"

export default async (url, from = '/') => {

    const {value: user} = useUser()

    // очищаем неудачный fetch для последующих заходов на страницу (lifehooks должны идти до первого await)
    onUnmounted(() => {
        if (data.value === null) clearNuxtData(url)
    })

    const {data} = await useLazyAsyncData(url, async () => {
        try {
            if (!user.sessionToken || Date.parse(user.sessionExp) - 10e3 < Date.now()) {
                const isRefresh = await refreshUser()
                if (!isRefresh) throw new Error('no Auth!')
            }
            const result = await $fetch(url, {
                headers: {
                    sessionToken: user.sessionToken
                }
            })
            if (result.status === 'auth error') throw new Error('no Auth!')
            return result
        } catch (e) {
            console.log(`${e}`);
            await navigateTo('/user/login?from=' + from)
            return null
        }
    }, {server: false,})
// очищаем неудачный fetch для последующих заходов на страницу
//     const unwatch = watch(pending, async () => {
//         if (pending.value) return // т.к. сначала будет true при втором заходе на страницу
//         unwatch() // only once
//         if (data.value === null) clearNuxtData(url)
//     })
//     onUnmounted(() => {
//         console.log(`unmount`);
//         if (data.value === null) clearNuxtData(url)
//     })

    return data
}