export default defineEventHandler(async event => {
  const { cat_id, parent_id } = getQuery(event)

  if (!cat_id) throw createError({ statusCode: 400, statusMessage: 'cat_id is required' })

  const pId = Number(parent_id)
  const propsGroups = Array.from(usePrpsGroupsMap().keys())
  const selectProps = propsGroups.join(', ')

  let products = []

  if (pId === 0 || !parent_id) {
    // Root category selected
    products = await dbReq(`SELECT id, name, alias, standart_ids, reestr_ids, pasport_ids, ${selectProps} FROM i_products WHERE category_id = ?`, [cat_id])
  } else {
    // Sub-category selected: filter by properties of the sub-category
    const catData = (await dbReq(`SELECT * FROM i_categories WHERE id = ? LIMIT 1`, [cat_id]))[0]
    if (!catData) throw createError({ statusCode: 404, statusMessage: 'Category not found' })

    const activeProps = []
    for (const key in catData) {
      if (/^p\d_/.test(key) && catData[key]) {
        activeProps.push({ key, val: catData[key] })
      }
    }

    const params = [pId]
    const propFilters = activeProps.reduce((acc, prop) => {
      params.push(prop.val)
      return acc + ` AND ${prop.key} = ?`
    }, '')

    products = await dbReq(`SELECT id, name, alias, standart_ids, reestr_ids, pasport_ids, ${selectProps} FROM i_products WHERE category_id = ?${propFilters}`, params)
  }

  if (!products.length) return []

  const rootCatId = pId === 0 || !parent_id ? Number(cat_id) : pId

  // Sort products using category filter properties logic
  const filterGroups = usePrpsGroupsMap(rootCatId)
  const allProps = []

  for (const propKey of filterGroups.keys()) {
    filterGroups.get(propKey).ids = {}

    products.forEach(product => {
      if (!filterGroups.get(propKey).disabled && product[propKey] > 0) {
        filterGroups.get(propKey).ids[product[propKey]] = (filterGroups.get(propKey).ids[product[propKey]] || 0) + 1
        if (product.props === undefined) product.props = []
        product.props.push(product[propKey])
      }
    })
    for (const id in filterGroups.get(propKey).ids) {
      if (filterGroups.get(propKey).ids[id] === products.length) delete filterGroups.get(propKey).ids[id]
      else allProps.push(id)
    }
  }

  if (allProps.length) {
    const query = `SELECT id, name, ordering FROM i_properties WHERE id IN (${allProps.map(() => '?').join(',')})`
    const propsArr = await dbReq(query, allProps)
    const props = {}
    propsArr.forEach(prop => {
      props[prop.id] = { name: prop.name, order: prop.ordering }
    })

    const filter = Array.from(filterGroups.values())
      .filter(fGroup => !fGroup.disabled && Object.keys(fGroup.ids).length > 0)
      .sort((a, b) => a.ordering - b.ordering)

    filter.forEach(fGroup => {
      fGroup.values = []
      for (const id in fGroup.ids) {
        fGroup.values.push({
          val: Number(id),
          name: props[id]?.name || '',
        })
      }
      fGroup.values.sort((a, b) => (props[a.val]?.order || 0) - (props[b.val]?.order || 0))
    })

    products.sort((a, b) => {
      for (const fGroup of filter) {
        for (const prop of fGroup.values) {
          const isA = a.props?.includes(prop.val)
          const isB = b.props?.includes(prop.val)
          if (isA && !isB) return -1
          if (!isA && isB) return 1
        }
      }
      return 0
    })
  }

  // Clean up property fields and temporary props array
  products.forEach(product => {
    propsGroups.forEach(key => delete product[key])
    delete product.props
  })

  return products
})
