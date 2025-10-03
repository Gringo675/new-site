import { defineOrganization } from 'nuxt-schema-org/schema'
import useCompany from './app/composables/useCompany.js'
const company = useCompany()

export default defineNuxtConfig({
  app: {
    // baseURL: process.env.NODE_ENV === 'production' ? '/test/' : '/',
    // baseURL: '/test/',
    head: {
      htmlAttrs: {
        lang: 'ru',
      },
      meta: [
        // { name: 'robots', content: 'noindex, nofollow' },
        { name: 'apple-mobile-web-app-title', content: 'ТД ЧИ' },
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/static/assets/favicons/favicon-96x96.png', sizes: '96x96' },
        { rel: 'icon', type: 'image/svg+xml', href: '/static/assets/favicons/favicon.svg' },
        { rel: 'shortcut icon', href: '/static/assets/favicons/favicon.ico' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/static/assets/favicons/apple-touch-icon.png' },
        { rel: 'manifest', href: '/static/assets/favicons/site.webmanifest' },
      ],
    },
  },
  css: ['~/assets/css/main.css'],
  modules: ['@nuxt/ui', '@nuxtjs/sitemap', 'nuxt-schema-org', '@nuxtjs/robots'],

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
    DL_APP_KEY: process.env.DL_APP_KEY,
    STATIC_ABSOLUTE_PATH: process.env.STATIC_ABSOLUTE_PATH,
    public: {
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
      VK_CLIENT_ID: process.env.VK_CLIENT_ID,
      MAILRU_CLIENT_ID: process.env.MAILRU_CLIENT_ID,
    },
  },

  devtools: {
    timeline: {
      enabled: true,
    },
  },
  experimental: {
    purgeCachedData: false, // nuxt v3.17 breaking change (delete cache when component-initiator is unmounted)
  },
  site: {
    // used in SEO modules
    title: 'Челябинский Инструмент',
    url: 'https://chelinstrument.ru',
    description: 'Интернет-магазин измерительных инструментов. Официальный сайт ООО ТД «Челябинский Инструмент».',
    name: 'Челябинский Инструмент',
    indexable: false,
  },
  sitemap: {
    exclude: ['/admin/**', '/user/**', '/try/**'],
    sources: ['/api/__sitemap__/urls'],
    xslColumns: [{ label: 'URL', width: '100%' }],
  },
  robots: {
    disallow: ['/admin', '/search', '/user', '/cart', '/try', '/test', '/*?f='],
  },
  schemaOrg: {
    identity: defineOrganization({
      '@type': ['Organization', 'Store', 'OnlineStore'],
      name: company.name,
      logo: '/img/logo.svg',
      address: {
        '@type': 'PostalAddress',
        streetAddress: company.address.streetAddress,
        addressLocality: company.address.addressLocality,
        postalCode: company.address.postalCode,
        addressCountry: company.address.addressCountry,
      },
      contactPoint: [
        {
          '@type': 'ContactPoint',
          telephone: company.phones[0],
          contactType: 'customer service',
          email: company.mails[0],
        },
        {
          '@type': 'ContactPoint',
          telephone: company.phones[1],
          contactType: 'technical support',
          email: company.mails[1],
        },
      ],
    }),
  },
  compatibilityDate: '2025-03-07',
})
