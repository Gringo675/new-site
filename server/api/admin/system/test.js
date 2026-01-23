import MiniSearch from 'minisearch'
const storage = useStorage('data')

export default defineEventHandler(async event => {
  //
  const prev = await storage.getItem('test.json')
  
  const rnd = Math.floor(Math.random() * 1000)

  await storage.setItem('test.json', { rnd })
  const cached = await storage.getItem('test.json')
  return { prev, rnd, cached }
  // const searchIndex = getSearchIndex()
  // return searchIndex.documentCount

  // A collection of documents for our examples
  // const documents = [
  //   { id: 1, title: 'Война и мирss' },
  //   { id: 2, title: 'Пиньях' },
  // ]
  // const options = {
  //   fields: ['id', 'title'], // fields to index for full-text search
  //   storeFields: ['id', 'title'], // fields to return with search results
  //   searchOptions: { prefix: true, fuzzy: 0.2 },
  // }
  // let miniSearch = new MiniSearch(options)
  // // Index all documents
  // miniSearch.addAll(documents)
  // const storage = useStorage('assets:server')
  // await storage.setItem('indexTest.json', miniSearch)
  // const cachedIndex = (await storage.getItemRaw('indexTest.json')).toString()
  // console.log('Type of cachedIndex:', typeof cachedIndex)
  // console.log(`cachedIndex: ${cachedIndex}`)
  // miniSearch.removeAll()
  // miniSearch = MiniSearch.loadJSON(cachedIndex, options)
  // const count = miniSearch.documentCount
  // console.log(`There are ${count} documents in the index.`)
  // let results = miniSearch.search('2')
  // return results
})
