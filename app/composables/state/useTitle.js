export default title => {
  const route = useRoute()
  const siteConfig = useSiteConfig()
  const fullTitle = title + ' - ТД ЧИ'
  useSeoMeta({
    title: fullTitle,
    ogTitle: fullTitle,
    ogUrl: `${siteConfig.url}${route.path}`,
    ogType: 'website',
    ogSiteName: siteConfig.name,
    ogLocale: 'ru_RU',
  })
}
