import MiniSearch from 'minisearch'

export default defineEventHandler(async event => {
  //
  const searchIndex = getSearchIndex()
  return searchIndex.documentCount

  // A collection of documents for our examples
  // const documents = [
  //   { id: 1, title: 'Война и мирss' },
  //   { id: 2, title: 'Пиньях' },
  // ]
  // const options = {
  //   fields: ['title'], // fields to index for full-text search
  //   storeFields: ['id', 'title'], // fields to return with search results
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
  // let results = miniSearch.search('Hobbit').length
  // return results
})
