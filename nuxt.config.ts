// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config

export default defineNuxtConfig({
    app: {
        baseURL: process.env.NODE_ENV === 'production' ? '/test/' : '/',
        head: {
            meta: [
                {name: 'robots', content: 'noindex, nofollow'}
            ]
        }
    },
    modules: ['@nuxtjs/tailwindcss'],
    routeRules: {
        '/admin/**': {ssr: false},
        '/user/**': {ssr: false},
    },
    imports: {
        dirs: [
            'composables/*' // scan modules nested one level deep
        ]
    },
    runtimeConfig: {
        dbHost: process.env.NODE_ENV === 'production' ? process.env.DB_HOST : process.env.DB_HOST_LOCAL,
        dbName: process.env.DB_NAME,
        dbUser: process.env.DB_USER,
        dbPassword: process.env.DB_PASSWORD
    },
})
