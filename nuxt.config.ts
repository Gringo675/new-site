// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
export default defineNuxtConfig({
    modules: ['@nuxtjs/tailwindcss'],
    routeRules: {
        '/admin/**': {ssr: false},
        '/user/**': {ssr: false},
        // '/test_fetch': {ssr: false}
    }
})
