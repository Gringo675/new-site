/**
 * выполняет поиск по каталогу
 * q - строка поиска
 * f - флаг быстрого поиска (max 10 результатов)
 */

const searchIndex = useSearchIndex()

export default defineEventHandler(async event => {
  //
  if (searchIndex.documentCount === 0) await initSearchIndex()

  const { q, f } = getQuery(event)

  // длина на 1 символ меньше, т.к. при запросе обрезается пробел в конце
  if (typeof q !== 'string' || q.length < 2) throw createError({ statusCode: 505, statusMessage: `Incorrect request!` })
  const fastSearch = f === '1'

  const result = searchIndex.search(q)

  if (result.length === 0) return { products: [] }

  const total = result.length
  const limitedResult = fastSearch ? result.slice(0, 10) : result.slice(0, 100)

  const products = limitedResult.map((item, index) => ({
    id: item.id,
    name: item.name,
    alias: item.alias,
    price: item.price,
    priceRegular: item.priceRegular,
    image: item.image,
    label: item.label,
    order: index,
  }))

  const cats = new Map()
  limitedResult.forEach(item => {
    item.matchedCats.forEach(cat => {
      if (!cats.has(cat.alias)) {
        cats.set(cat.alias, cat)
      }
    })
  })

  return {
    products,
    cats: Array.from(cats.values()),
    total,
  }
})

const initSearchIndex = async () => {
  // Init search index on server startup
  try {
    // refresh index for main site 'cause after deploy there may be stale json file
    const count = useRuntimeConfig().public.PROD_MODE ? await refreshSearchIndex() : await activateSearchIndex()
    if (count > 0) console.log(`Search index activated with ${count} documents.`)
    else throw new Error('Search index activated, but has no documents!')
  } catch (e) {
    $fetch('/api/log/setError', {
      method: 'POST',
      body: {
        statusCode: 777,
        statusMessage: `Error activating search index : ${e.message}`,
        url: '/api/getData/search',
        stack: e.stack,
        onServer: true,
      },
    })
    console.error(e)
  }
}
