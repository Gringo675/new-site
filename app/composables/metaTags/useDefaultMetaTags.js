export const useDefaultMetaTags = () => {
  const siteConfig = useSiteConfig()

  useSeoMeta({
    title: siteConfig.title,
    description: siteConfig.description,
  })
}
