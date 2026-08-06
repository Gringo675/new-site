export default defineEventHandler(async event => {
  const alias = getRouterParam(event, 'c_alias')

  if (!alias || !alias.length) {
    throw createError({ statusCode: 500, statusMessage: 'Incorrect URI!' })
  }

  // 1. Get category data
  let query = `SELECT * FROM i_categories WHERE alias = ? AND published = 1 LIMIT 1`
  const catData = (await dbReq(query, [alias]))[0]
  if (catData === undefined) {
    throw createError({ statusCode: 404, statusMessage: 'Category Not Found!' })
  }

  // 2. Subcategory active property filters
  const catActiveProps = []
  if (catData.parent_id !== 0) {
    for (const key in catData) {
      if (/^p\d_/.test(key) && catData[key] && String(catData[key]).length) {
        catActiveProps.push([key, catData[key]])
      }
    }
  }

  // 3. Resolve parent products category ID
  let productsCatId
  if (catData.parent_id === 0) {
    productsCatId = catData.id
  } else {
    query = `SELECT parent_id FROM i_categories WHERE id = ? LIMIT 1`
    const parentResult = await dbReq(query, [catData.parent_id])
    const parentParentId = parentResult[0]?.parent_id ?? 0
    productsCatId = parentParentId > 0 ? parentParentId : catData.parent_id
  }

  // 4. Fetch published products matching category / subcategory
  const productParams = [productsCatId]
  const productFilter = catActiveProps.reduce((acc, prop) => {
    const ids = prop[1].split(',').map(Number)
    const placeholders = ids.map(() => '?').join(',')
    productParams.push(...ids)
    return acc + `AND ${prop[0]} IN (${placeholders}) `
  }, '')

  query = `SELECT id, name, category_id,
                  p0_brand, p1_type, p2_counting_system, p3_range, p4_size, p5_accuracy, p6_class, p7_feature, p8_pack,
                  standart_ids, reestr_ids
                  FROM i_products WHERE category_id = ?
                  ${productFilter}
                  AND published = 1`
  const products = await dbReq(query, productParams)

  // 5. Extract unique standart_ids and reestr_ids and map to products
  const stndMap = new Map()
  const rstrMap = new Map()

  products.forEach(product => {
    if (product.standart_ids && product.standart_ids.length) {
      product.standart_ids.split(',').forEach(idStr => {
        const id = idStr.trim()
        if (!id) return
        if (!stndMap.has(id)) {
          stndMap.set(id, new Set())
        }
        stndMap.get(id).add(product.name)
      })
    }
    if (product.reestr_ids && product.reestr_ids.length) {
      product.reestr_ids.split(',').forEach(idStr => {
        const id = idStr.trim()
        if (!id) return
        if (!rstrMap.has(id)) {
          rstrMap.set(id, new Set())
        }
        rstrMap.get(id).add(product.name)
      })
    }
  })

  // 6. Fetch docs from i_docs_stnd and i_docs_rstr
  const docs = {
    stnd: [],
    rstr: [],
  }

  const stndIds = Array.from(stndMap.keys())
  if (stndIds.length) {
    query = `SELECT id, number, name, file FROM i_docs_stnd WHERE id IN (${stndIds.map(() => '?').join(',')})`
    const stndRows = await dbReq(query, stndIds)
    docs.stnd = stndRows.map(row => ({
      number: row.number,
      name: row.name,
      file: row.file,
      products: Array.from(stndMap.get(String(row.id)) || []),
    }))
  }

  const rstrIds = Array.from(rstrMap.keys())
  if (rstrIds.length) {
    query = `SELECT id, number, name, type_si, brand, date, file_ot, file_mp FROM i_docs_rstr WHERE id IN (${rstrIds.map(() => '?').join(',')})`
    const rstrRows = await dbReq(query, rstrIds)
    docs.rstr = rstrRows.map(row => ({
      number: row.number,
      name: row.name,
      type_si: row.type_si,
      brand: row.brand,
      date: row.date,
      file_ot: row.file_ot,
      file_mp: row.file_mp,
      products: Array.from(rstrMap.get(String(row.id)) || []),
    }))
  }

  // 7. Resolve categorySummary availableProps via usePrpsGroupsMap and i_properties
  const filterGroups = usePrpsGroupsMap(productsCatId)
  const allPropsIds = new Set()
  const groupPropValues = new Map() // propKey -> Set of property IDs

  for (let propKey of filterGroups.keys()) {
    groupPropValues.set(propKey, new Set())
    products.forEach(product => {
      if (!filterGroups.get(propKey).disabled && product[propKey] > 0) {
        groupPropValues.get(propKey).add(product[propKey])
      }
    })
    groupPropValues.get(propKey).forEach(id => allPropsIds.add(id))
  }

  const availableProps = {}
  const allPropsIdsArr = Array.from(allPropsIds)
  if (allPropsIdsArr.length) {
    query = `SELECT id, name FROM i_properties WHERE id IN (${allPropsIdsArr.map(() => '?').join(',')})`
    const propsArr = await dbReq(query, allPropsIdsArr)
    const propsMap = new Map()
    propsArr.forEach(p => propsMap.set(p.id, p.name))

    for (let [propKey, idSet] of groupPropValues.entries()) {
      const groupInfo = filterGroups.get(propKey)
      if (groupInfo.disabled) continue
      if (idSet.size > 0) {
        const names = []
        idSet.forEach(id => {
          if (propsMap.has(id)) {
            names.push(propsMap.get(id))
          }
        })
        if (names.length > 0) {
          const propName = groupInfo.name
          availableProps[propName] = names
        }
      }
    }
  }

  const categorySummary = {
    totalProducts: products.length,
    availableProps,
  }

  const resultCatData = {
    name: catData.name,
    alias: catData.alias,
    description: catData.description || '',
    characteristics: catData.characteristics || '',
  }

  return {
    catData: resultCatData,
    docs,
    categorySummary,
  }
})
