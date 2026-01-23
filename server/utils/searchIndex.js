import MiniSearch from 'minisearch'
const storage = useStorage('assets:server')

const miniSearchOptions = {
  tokenize: text => text.split(/[^\p{L}\p{N}-]+/gu).filter(Boolean), // exclude hyphen (-) from separators
  processTerm: term => {
    if (term.includes('-')) {
      // add variants for terms with hyphen: aa-11 -> ['aa-11', 'aa', '11', 'aa11']
      return [term.toLowerCase(), ...term.split('-').map(t => t.toLowerCase()), term.replace(/-/g, '')].map(t =>
        t.toLowerCase(),
      )
    }
    return term.toLowerCase() // default normalization
  },
  fields: ['id', 'index'], // fields to index for full-text search
  storeFields: ['id', 'name', 'alias', 'price', 'priceRegular', 'image', 'label', 'matchedCats'], // fields to return with search results
  searchOptions: {
    prefix: true,
    fuzzy: 0.2, // Note: 0.1 allows 1 typo for every 10 characters
    combineWith: 'AND',
    processTerm: term => term.toLowerCase(), // default normalization during search
  },
}

const searchIndex = new MiniSearch(miniSearchOptions)

export const useSearchIndex = () => {
  return searchIndex
}

export const activateSearchIndex = async () => {
  // load docs from /server/assets/searchIndexDocs.json
  const docs = await storage.getItem('searchIndexDocs.json')

  searchIndex.removeAll()
  searchIndex.addAll(docs)

  // console.log(`There are ${searchIndex.documentCount} documents in the index.`)

  return searchIndex.documentCount
}

export const refreshSearchIndex = async () => {
  //
  await createSearchIndexDocsJSON()
  await activateSearchIndex()

  return searchIndex.documentCount
}

const createSearchIndexDocsJSON = async () => {
  const propsGroups = usePropsGroups()

  const prodsQuery = `SELECT
    p.id,
    p.name,
    p.alias,
    p.category_id,
    p.price, p.special_price, p.images, p.label,
    ${propsGroups.map(group => 'p.' + group).join(', ')},
    prop1.name AS p1_name,
    prop2.name AS p2_name,
    prop3.name AS p7_name,
    (SELECT GROUP_CONCAT(number SEPARATOR ' ') FROM i_docs_stnd WHERE FIND_IN_SET(id, p.standart_ids)) as stnd_numbers,
    (SELECT GROUP_CONCAT(number SEPARATOR ' ') FROM i_docs_rstr WHERE FIND_IN_SET(id, p.reestr_ids)) as rstr_numbers
  FROM
      i_products AS p
  LEFT JOIN i_properties AS prop1 ON p.p1_type = prop1.id
  LEFT JOIN i_properties AS prop2 ON p.p2_counting_system = prop2.id
  LEFT JOIN i_properties AS prop3 ON p.p7_feature = prop3.id
  WHERE
      p.category_id = 34 AND p.published = 1`
  // p.category_id = 16 AND p.published = 1`
  const prods = await dbReq(prodsQuery)

  // Fetch all sub-categories (in search we use only second level categories)
  const catsQuery = `SELECT id, name, alias, parent_id, ${propsGroups.join(', ')} FROM i_categories WHERE published = 1 AND parent_id > 0 AND parent_id < 100`
  const categories = await dbReq(catsQuery)

  const catsMap = new Map()
  for (const cat of categories) {
    // build cat's regexp from its properties to match against products
    cat.regexp = new RegExp(`^${propsGroups.map(group => (cat[group] === '' ? '.*' : cat[group])).join(',')}$`)
    if (!catsMap.has(cat.parent_id)) {
      catsMap.set(cat.parent_id, [cat])
    } else catsMap.get(cat.parent_id).push(cat)
  }

  for (const prod of prods) {
    // Build search index for the product
    prod.index = prod.name.toLowerCase()
    if (prod.p1_name && !prod.index.includes(prod.p1_name)) prod.index += ` ${prod.p1_name}`
    if (prod.p2_name && !prod.index.includes(prod.p2_name)) prod.index += ` ${prod.p2_name}`
    if (prod.p7_name && !prod.index.includes(prod.p7_name)) prod.index += ` ${prod.p7_name}`
    if (prod.stnd_numbers) prod.index += ` ${prod.stnd_numbers}`
    if (prod.rstr_numbers) prod.index += ` ${prod.rstr_numbers}`

    // Find matched categories based on product properties
    const props = propsGroups.map(group => prod[group]).join(',')
    prod.matchedCats = []
    for (const cat of catsMap.get(prod.category_id) || []) {
      if (cat.regexp.test(props)) prod.matchedCats.push({ name: cat.name, alias: cat.alias })
    }
  }

  const docs = prods.map(prod => ({
    id: prod.id,
    name: prod.name,
    alias: prod.alias,
    index: prod.index,
    price: prod.special_price > 0 ? prod.special_price : prod.price,
    priceRegular: prod.special_price > 0 ? prod.price : undefined,
    image: prod.images.match(/^[^,]+/)[0], // берем только первое изображение
    label: prod.label,
    matchedCats: prod.matchedCats,
  }))

  //save docs to /server/assets/searchIndexDocs.json
  await storage.setItem('searchIndexDocs.json', docs)
}
