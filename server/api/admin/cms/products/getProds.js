export default defineEventHandler(async event => {
  const table = 'i_products2'
  const { cat_id, parent_id } = getQuery(event)

  if (!cat_id) throw createError({ statusCode: 400, statusMessage: 'cat_id is required' })

  const pId = Number(parent_id)

  if (pId === 0 || !parent_id) {
    // Root category selected
    return await dbReq(`SELECT id, name, alias, brand_eans, images, description, characteristics, p0_brand, p1_type, p2_counting_system, p3_range, p4_size, p5_accuracy, p6_class, p7_feature, p8_pack, label, published FROM ${table} WHERE category_id = ${cat_id}`)
  }

  // Sub-category selected: filter by properties of the sub-category
  const catData = (await dbReq(`SELECT * FROM i_categories WHERE id = ${cat_id} LIMIT 1`))[0]
  if (!catData) throw createError({ statusCode: 404, statusMessage: 'Category not found' })

  const activeProps = []
  for (const key in catData) {
    if (/^p\d_/.test(key) && catData[key]) {
      activeProps.push({ key, val: catData[key] })
    }
  }

  const propFilters = activeProps.reduce((acc, prop) => {
    acc += ` AND ${prop.key} = ${prop.val}`
    return acc
  }, '')

  return await dbReq(`SELECT id, name, alias, brand_eans, images, description, characteristics, p0_brand, p1_type, p2_counting_system, p3_range, p4_size, p5_accuracy, p6_class, p7_feature, p8_pack, label, published FROM ${table} WHERE category_id = ${pId}${propFilters}`)
})
