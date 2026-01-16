const searchIndex = getSearchIndex()

export default defineEventHandler(async event => {
  const { q } = getQuery(event)
  const results = searchIndex.search(q)
  return results
})
