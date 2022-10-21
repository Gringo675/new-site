
export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.$router.options.scrollBehavior = (to, from, savedPosition) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    top: savedPosition?.top || 0,
                    behavior: 'smooth'
                })
            }, 400)
        })
    }
})