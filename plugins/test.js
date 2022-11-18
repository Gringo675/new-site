import { callWithNuxt } from '#app'

export default defineNuxtPlugin(nuxtApp => {
    async function timer(sec) {
        console.log(`from timer`)
        let promise = new Promise((resolve, reject) => {
            setTimeout(() => resolve(), sec * 1000)
        });
        return await promise;
    }
    return {
        provide: {
            hello: (msg) => `Hello ${msg}!`,
            useTest: async () => {
                const nuxtApp = useNuxtApp()
                await timer(2)
                if (process.server) {
                    callWithNuxt(nuxtApp, navigateTo, ['/user/login'])
                    // navigateTo('/user/login')
                }
            }
        }
    }

})