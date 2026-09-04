export const useDefaultMetaTags = () => {
  const siteConfig = useSiteConfig()
  const route = useRoute()

  useSeoMeta({
    title: siteConfig.title,
    description: siteConfig.description,
    ogTitle: siteConfig.title,
    ogDescription: siteConfig.description,
    ogUrl: `${siteConfig.url}${route.path}`,
    ogType: 'website',
    ogSiteName: siteConfig.name,
    ogLocale: 'ru_RU',
    ogImage: `${siteConfig.url}/img/logo.svg`,
  })
}
