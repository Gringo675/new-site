import { defineSitemapEventHandler } from '#imports'
import type { SitemapUrl } from '#sitemap/types'

export default defineSitemapEventHandler(async (): Promise<SitemapUrl[]> => {
  const cats = (await dbReq(`SELECT alias FROM i_categories WHERE published = 1`)) as { alias: string }[]
  const prods = (await dbReq(`SELECT alias FROM i_products WHERE published = 1`)) as { alias: string }[]

  const urls = [
    ...cats.map(cat => ({ loc: `/catalog/${cat.alias}` })),
    ...prods.map(prod => ({ loc: `/product/${prod.alias}` })),
  ]

  return urls
})
