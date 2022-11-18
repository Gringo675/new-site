import { callWithNuxt } from '#app'

export default async () => {
    const nuxtApp = useNuxtApp()
     await timer(1)

    if (process.server) {
        callWithNuxt(nuxtApp, navigateTo, ['/user/login'])
        // navigateTo('/user/login')

    }

    return 'qqq'
}

async function timer(sec) {
    let promise = new Promise((resolve, reject) => {
        setTimeout(() => resolve(), sec * 1000)
    });
    return await promise;
}