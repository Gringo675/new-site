
// @ts-ignore
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
        '/test1': {ssr: false}
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
        JWT_TOKEN: process.env.JWT_TOKEN,
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
        VK_CLIENT_SECRET: process.env.VK_CLIENT_SECRET,
        MAILRU_CLIENT_SECRET: process.env.MAILRU_CLIENT_SECRET,
        MAIL_HOST: process.env.MAIL_HOST,
        MAIL_PORT: process.env.MAIL_PORT,
        MAIL_USER: process.env.MAIL_USER,
        MAIL_PASS: process.env.MAIL_PASS,
        public: {
            GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
            VK_CLIENT_ID: process.env.VK_CLIENT_ID,
            MAILRU_CLIENT_ID: process.env.MAILRU_CLIENT_ID
        }
    },
})
