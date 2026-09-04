import { defineSitemapEventHandler } from '#imports'
import type { SitemapUrl } from '#sitemap/types'

export default defineSitemapEventHandler(async (): Promise<SitemapUrl[]> => {
  const cats = (await dbReq(`SELECT alias FROM i_categories WHERE published = 1`)) as { alias: string }[]
  const prods = (await dbReq(`SELECT alias FROM i_products WHERE published = 1`)) as { alias: string }[]

  // Текущая дата для сигнализации Google об обновлении
  // todo: need to get real lastmod date from db
  // const today = new Date().toISOString()

  const urls = [
    {
      loc: '/llms.txt',
    },
    {
      loc: '/llms-full.txt',
    },
    ...cats.map(cat => ({
      loc: `/catalog/${cat.alias}`,
      // lastmod: today,
    })),
    ...prods.map(prod => ({
      loc: `/product/${prod.alias}`,
      // lastmod: today,
    })),
  ]

  return urls
})
