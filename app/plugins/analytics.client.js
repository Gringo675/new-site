// Плагин отслеживает переходы по страницам для Google Analytics и Яндекс.Метрики

export default defineNuxtPlugin(nuxtApp => {
  //
  const router = useRouter()
  const config = useRuntimeConfig()

  const gtagId = config.public.GOOGLE_ANALYTICS_ID
  const ymId = config.public.YANDEX_METRIKA_ID

  router.afterEach((to, from) => {
    //
    if (!config.public.PROD_MODE) return // only in prod mode
    if (to.fullPath === from.fullPath) return // skip initial page load

    setTimeout(() => {
      const pageTitle = document.title

      // --- Логика для Google Analytics  ---
      try {
        window.gtag('config', gtagId, {
          page_path: to.fullPath,
          page_title: pageTitle,
        })
      } catch (e) {
        console.error('[Analytics Plugin]: Error sending GA page_view', e)
      }

      // --- Логика для Яндекс.Метрики ---
      try {
        window.ym(ymId, 'hit', to.fullPath, {
          title: pageTitle,
          referrer: from.fullPath,
        })
      } catch (e) {
        console.error('[Analytics Plugin]: Error sending YM hit', e)
      }
    }, 500) // delay to ensure title is updated
  })
})
