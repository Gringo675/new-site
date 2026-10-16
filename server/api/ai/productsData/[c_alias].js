/**
 * Парсит строку со списком ID через запятую в массив уникальных положительных чисел.
 * @param {string | null | undefined} idsStr
 * @returns {number[]}
 */
function parseIdList(idsStr) {
  if (!idsStr || typeof idsStr !== 'string') return []
  return idsStr
    .split(',')
    .map(s => Number(s.trim()))
    .filter(id => Number.isInteger(id) && id > 0)
}

/**
 * Сравнивает два ID документов для сортировки (year DESC, затем doc number ASC).
 * @param {number} a
 * @param {number} b
 * @param {Record<string | number, { year?: number, number?: string }>} docDict
 * @returns {number}
 */
function compareDocIds(a, b, docDict) {
  const docA = docDict[a]
  const docB = docDict[b]
  const yearA = docA?.year ?? -1
  const yearB = docB?.year ?? -1

  if (yearA !== yearB) {
    if (yearA === -1) return 1
    if (yearB === -1) return -1
    return yearB - yearA
  }

  const numA = docA?.number || ''
  const numB = docB?.number || ''
  return numA.localeCompare(numB, 'ru', { numeric: true })
}

export default defineEventHandler(async event => {
  const alias = getRouterParam(event, 'c_alias')

  if (!alias || !alias.length) {
    throw createError({ statusCode: 500, statusMessage: 'Incorrect URI!' })
  }

  // 1. Get category data
  const catRows = await dbReq(`SELECT * FROM i_categories WHERE alias = ? AND published = 1 LIMIT 1`, [alias])
  const catData = catRows[0]
  if (!catData) {
    throw createError({ statusCode: 404, statusMessage: 'Category Not Found!' })
  }

  // 2. Resolve root category ID (products always belong to root categories)
  let productsCatId
  if (catData.parent_id === 0) {
    productsCatId = catData.id
  } else {
    const parentRows = await dbReq(`SELECT parent_id FROM i_categories WHERE id = ? LIMIT 1`, [catData.parent_id])
    const parentParentId = parentRows[0]?.parent_id ?? 0
    productsCatId = parentParentId > 0 ? parentParentId : catData.parent_id
  }

  // 3. Resolve active subcategory property filters
  const catActiveProps = []
  if (catData.parent_id !== 0) {
    for (const key in catData) {
      if (/^p\d_/.test(key) && catData[key] && String(catData[key]).length) {
        catActiveProps.push([key, String(catData[key])])
      }
    }
  }

  // 4. Fetch published products matching category / subcategory
  const catProps = usePrpsGroupsMap(productsCatId)
  const propKeys = Array.from(catProps.keys())
  const selectProps = propKeys.join(', ')

  const productParams = [productsCatId]
  const productFilter = catActiveProps.reduce((acc, [key, val]) => {
    const ids = parseIdList(val)
    if (!ids.length) return acc
    const placeholders = ids.map(() => '?').join(',')
    productParams.push(...ids)
    return `${acc} AND ${key} IN (${placeholders})`
  }, '')

  const productsQuery = `SELECT id, name, alias, category_id, characteristics, is_ai_characteristics,
                                ${selectProps},
                                standart_ids, reestr_ids
                         FROM i_products
                         WHERE category_id = ?
                         ${productFilter}
                         AND published = 1`
  const products = await dbReq(productsQuery, productParams)

  if (!products.length) {
    return {
      category: {
        id: catData.id,
        name: catData.name,
        alias: catData.alias,
        characteristics: catData.characteristics || '',
      },
      docs: { stnd: {}, rstr: {} },
      products: [],
    }
  }

  // 5. Collect unique property IDs and document IDs across products
  const uniquePropIds = new Set()
  const uniqueStndIds = new Set()
  const uniqueRstrIds = new Set()

  products.forEach(product => {
    propKeys.forEach(key => {
      const propId = product[key]
      if (propId > 0) {
        uniquePropIds.add(propId)
      }
    })

    parseIdList(product.standart_ids).forEach(id => uniqueStndIds.add(id))
    parseIdList(product.reestr_ids).forEach(id => uniqueRstrIds.add(id))
  })

  // 6. Fetch properties and documents in parallel
  const propsMap = new Map()
  const docs = {
    stnd: {},
    rstr: {},
  }

  // Cache for document markdown text to avoid redundant HTTP requests
  const docTextCache = new Map()
  const fetchDocText = async fileName => {
    if (!fileName || typeof fileName !== 'string' || !fileName.trim()) {
      return ''
    }
    const cleanName = fileName.trim()
    if (docTextCache.has(cleanName)) {
      return docTextCache.get(cleanName)
    }

    const fetchPromise = (async () => {
      const mdName = cleanName.replace(/\.pdf$/i, '.md')
      const url = `https://chelinstrument.ru/static/doc/parsed/md/${encodeURIComponent(mdName)}`
      try {
        const res = await fetch(url)
        if (res.ok) {
          return await res.text()
        }
      } catch (err) {
        console.error(`Error fetching doc text for ${cleanName}:`, err)
      }
      return ''
    })()

    docTextCache.set(cleanName, fetchPromise)
    return fetchPromise
  }

  const fetchPropertiesTask = async () => {
    if (!uniquePropIds.size) return
    const ids = Array.from(uniquePropIds)
    const query = `SELECT id, name, ordering FROM i_properties WHERE id IN (${ids.map(() => '?').join(',')})`
    const rows = await dbReq(query, ids)
    rows.forEach(p => propsMap.set(p.id, { name: p.name, ordering: p.ordering }))
  }

  const fetchStndDocsTask = async () => {
    if (!uniqueStndIds.size) return
    const ids = Array.from(uniqueStndIds)
    const query = `SELECT id, number, name, file FROM i_docs_stnd WHERE id IN (${ids.map(() => '?').join(',')})`
    const rows = await dbReq(query, ids)
    await Promise.all(
      rows.map(async row => {
        const fileTrim = row.file?.trim() || ''
        docs.stnd[row.id] = {
          id: row.id,
          number: row.number,
          name: row.name,
          year: parseDocYear(row.number),
          url: fileTrim ? `/static/doc/stnd/${encodeURIComponent(fileTrim)}` : '',
          text: await fetchDocText(row.file),
        }
      }),
    )
  }

  const fetchRstrDocsTask = async () => {
    if (!uniqueRstrIds.size) return
    const ids = Array.from(uniqueRstrIds)
    const query = `SELECT id, number, name, file_ot FROM i_docs_rstr WHERE id IN (${ids.map(() => '?').join(',')})`
    const rows = await dbReq(query, ids)
    await Promise.all(
      rows.map(async row => {
        const fileOtTrim = row.file_ot?.trim() || ''
        docs.rstr[row.id] = {
          id: row.id,
          number: row.number,
          name: row.name,
          year: parseDocYear(row.number),
          url_ot: fileOtTrim ? `/static/doc/rstr/${encodeURIComponent(fileOtTrim)}` : '',
          text_ot: await fetchDocText(row.file_ot),
        }
      }),
    )
  }

  await Promise.all([fetchPropertiesTask(), fetchStndDocsTask(), fetchRstrDocsTask()])

  // 7. Sort products by props using active category filter groups logic
  const filterGroups = usePrpsGroupsMap(productsCatId)

  for (const [propKey, group] of filterGroups.entries()) {
    group.ids = {}
    products.forEach(product => {
      const propId = product[propKey]
      if (!group.disabled && propId > 0) {
        group.ids[propId] = (group.ids[propId] || 0) + 1
        if (!product._propIds) product._propIds = new Set()
        product._propIds.add(propId)
      }
    })

    // Exclude values present in 100% of products (they do not affect sorting order)
    for (const id in group.ids) {
      if (group.ids[id] === products.length) {
        delete group.ids[id]
      }
    }
  }

  const filter = Array.from(filterGroups.values())
    .filter(fGroup => !fGroup.disabled && Object.keys(fGroup.ids).length > 0)
    .sort((a, b) => a.ordering - b.ordering)

  if (filter.length) {
    filter.forEach(fGroup => {
      fGroup.values = Object.keys(fGroup.ids).map(id => {
        const val = Number(id)
        return {
          val,
          order: propsMap.get(val)?.ordering ?? 0,
        }
      })
      fGroup.values.sort((a, b) => a.order - b.order)
    })

    products.sort((a, b) => {
      for (const fGroup of filter) {
        for (const prop of fGroup.values) {
          const isA = a._propIds?.has(prop.val)
          const isB = b._propIds?.has(prop.val)
          if (isA && !isB) return -1
          if (!isA && isB) return 1
        }
      }
      return 0
    })
  }

  // 8. Transform formatted products list
  const formattedProducts = products.map(product => {
    const props = {}
    let brand = null

    propKeys.forEach(key => {
      const propId = product[key]
      if (propId > 0 && propsMap.has(propId)) {
        const val = propsMap.get(propId).name
        if (key === 'p0_brand') {
          brand = val
        } else {
          const groupInfo = catProps.get(key)
          const propName = groupInfo?.name || key
          props[propName] = val
        }
      }
    })

    const stndIds = parseIdList(product.standart_ids)
    if (stndIds.length > 1) {
      stndIds.sort((a, b) => compareDocIds(a, b, docs.stnd))
    }

    const rstrIds = parseIdList(product.reestr_ids)
    if (rstrIds.length > 1) {
      rstrIds.sort((a, b) => compareDocIds(a, b, docs.rstr))
    }

    return {
      id: product.id,
      name: product.name || '',
      alias: product.alias || '',
      brand,
      characteristics: product.characteristics || '',
      is_ai_characteristics: Boolean(product.is_ai_characteristics),
      props,
      stndIds,
      rstrIds,
    }
  })

  return {
    category: {
      id: catData.id,
      name: catData.name,
      alias: catData.alias,
      characteristics: catData.characteristics || '',
    },
    docs,
    products: formattedProducts,
  }
})
