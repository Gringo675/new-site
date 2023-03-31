
export default defineNuxtConfig({
    app: {
        // baseURL: process.env.NODE_ENV === 'production' ? '/test/' : '/',
        baseURL: '/test/',
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
        // dbHost: process.env.NODE_ENV === 'production' ? process.env.DB_HOST : process.env.DB_HOST_LOCAL,
        dbHost: process.env.DB_HOST_LOCAL, // работает везде, и на localhost, и удаленно
        dbName: process.env.DB_NAME,
        dbUser: process.env.DB_USER,
        dbPassword: process.env.DB_PASSWORD,
        JWT_TOKEN: process.env.JWT_TOKEN
    },
})
