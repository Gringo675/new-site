export default defineEventHandler(async event => {
  const { cat_id, parent_id } = getQuery(event)

  if (!cat_id) throw createError({ statusCode: 400, statusMessage: 'cat_id is required' })

  const pId = Number(parent_id)

  if (pId === 0 || !parent_id) {
    // Root category selected
    return await dbReq(`SELECT id, name, alias, standart_ids, reestr_ids, pasport_ids FROM i_products WHERE category_id = ?`, [cat_id])
  }

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

  return await dbReq(`SELECT id, name, alias, standart_ids, reestr_ids, pasport_ids FROM i_products WHERE category_id = ?${propFilters}`, params)
})
