export default defineNuxtConfig({
  app: {
    // baseURL: process.env.NODE_ENV === 'production' ? '/test/' : '/',
    baseURL: '/test/',
    head: {
      htmlAttrs: {
        lang: 'ru',
      },
      meta: [{ name: 'robots', content: 'noindex, nofollow' }],
    },
  },
  css: ['~/assets/css/main.css'],
  modules: ['@nuxt/ui'],
  ui: {
    colorMode: false,
    theme: {
      colors: ['primary', 'secondary', 'tertiary', 'info', 'success', 'warning', 'error'],
    },
    fonts: true,
  },
  routeRules: {
    '/admin/**': { ssr: false },
    '/user/**': { ssr: false },
    '/search/**': { ssr: false },
    // '/test1': {
    //   cache: {
    //     swr: true,
    //     maxAge: 10,
    //     staleMaxAge: 15,
    //   },
    // },
    // '/api/apiTest': {
    //   cache: {
    //     swr: true,
    //     maxAge: 10,
    //     staleMaxAge: 15,
    //   },
    // },
  },

  imports: {
    dirs: [
      'composables/**', // scan all modules
    ],
  },

  components: [
    {
      path: '~/components/unprefixed',
      pathPrefix: false,
    },
    '~/components',
  ],

  runtimeConfig: {
    // dbHost: process.env.NODE_ENV === 'production' ? process.env.DB_HOST : process.env.DB_HOST_LOCAL,
    dbHost: process.env.DB_HOST_LOCAL, // работает везде, и на localhost, и удаленно
    dbName: process.env.DB_NAME,
    dbUser: process.env.DB_USER,
    dbPassword: process.env.DB_PASSWORD,
    dbOldName: process.env.DB_OLD_NAME,
    dbOldUser: process.env.DB_OLD_USER,
    dbOldPassword:
      process.env.NODE_ENV === 'production' ? process.env.DB_OLD_PASSWORD : process.env.DB_OLD_PASSWORD_LOCAL,
    JWT_TOKEN_KEY: process.env.JWT_TOKEN,
    JWT_TOKEN_LIFETIME: process.env.JWT_TOKEN_LIFETIME,
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
      MAILRU_CLIENT_ID: process.env.MAILRU_CLIENT_ID,
      IMAGES_DIRECTORY: process.env.IMAGES_DIRECTORY,
    },
  },

  colorMode: {
    preference: 'light',
  },

  devtools: {
    timeline: {
      enabled: true,
    },
  },
  experimental: {
    purgeCachedData: false, // nuxt v3.17 breaking change (delete cache when component-initiator is unmounted)
  },
  compatibilityDate: '2025-03-07',
})
