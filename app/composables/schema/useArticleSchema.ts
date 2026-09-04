export const useArticleSchema = (article: {
  headline: string
  description: string
  image: string
  datePublished?: string
  dateModified?: string
}) => {
  const siteConfig = useSiteConfig()

  useSchemaOrg([
    defineArticle({
      headline: article.headline,
      description: article.description,
      image: article.image.startsWith('http') ? article.image : `${siteConfig.url}${article.image}`,
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
