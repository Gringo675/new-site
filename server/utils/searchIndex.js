import MiniSearch from 'minisearch'
const storage = useStorage('assets:server')

const miniSearchOptions = {
  fields: ['id', 'index'], // fields to index for full-text search
  storeFields: ['name'], // fields to return with search results
  searchOptions: { prefix: true, fuzzy: 0.2 },
}

let searchIndex = new MiniSearch(miniSearchOptions)

export const getSearchIndex = () => {
  return searchIndex
}

export const activateSearchIndex = async () => {
  // load index from /server/assets/searchIndex.json
  const indexJSON = (await storage.getItemRaw('searchIndex.json')).toString()

  searchIndex.removeAll()
  searchIndex = MiniSearch.loadJSON(indexJSON, miniSearchOptions)
  // console.log(`There are ${searchIndex.documentCount} documents in the index.`)

  return searchIndex.documentCount
}

export const refreshSearchIndex = async () => {
  //
  const propsGroups = usePropsGroups()

  const prodsQuery = `SELECT
    p.id,
    p.name,
    p.alias,
    p.category_id,
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
      p.published = 1`
  // p.category_id = 29 AND p.published = 1`
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
    matchedCats: prod.matchedCats,
  }))

  searchIndex.removeAll()
  searchIndex.addAll(docs)
  // console.log(`There are ${searchIndex.documentCount} documents in the index.`)

  //save index to /server/assets/searchIndex.json
  await storage.setItem('searchIndex.json', searchIndex)

  return searchIndex.documentCount
}
