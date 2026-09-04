export const useArticleSchema = (article: {
  headline: string
  description: string
  image: string
  datePublished?: string
  dateModified?: string
}) => {
  const siteConfig = useSiteConfig()
  const route = useRoute()
  const currentUrl = route.path === '/' ? siteConfig.url : siteConfig.url + route.path
  const imageUrl = article.image.startsWith('http') ? article.image : `${siteConfig.url}${article.image}`

  useSeoMeta({
    ogDescription: article.description,
    ogImage: imageUrl,
    ogType: 'article',
    ogUrl: currentUrl,
  })

  useSchemaOrg([
    defineArticle({
      headline: article.headline,
      description: article.description,
      image: imageUrl,
      datePublished: article.datePublished || '2024-01-01T00:00:00+03:00',
      dateModified: article.dateModified || '2025-01-01T00:00:00+03:00',
      author: {
        '@id': `${siteConfig.url}/#identity`,
      },
      publisher: {
        '@id': `${siteConfig.url}/#identity`,
      },
    }),
  ])
}
