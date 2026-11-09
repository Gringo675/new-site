/**
 * Receives an array of products with updated fields, e.g.:
 * [{"id": 140002, "p2_counting_system": 277}]
 * if 'isNew' -> new product
 * if 'isDel' -> delete product
 */

export default defineEventHandler(async event => {
  const prods = await readBody(event)

  const table = 'i_products'
  const sortAffectingKeys = new Set([
    'category_id',
    'p0_brand',
    'p1_type',
    'p2_counting_system',
    'p3_range',
    'p4_size',
    'p5_accuracy',
    'p6_class',
    'p7_feature',
    'p8_pack',
  ])

  const recalculateIds = []

  for (const prod of prods) {
    if (prod.isDel) {
      await dbReq(`DELETE FROM ${table} WHERE id = ?`, [prod.id])
    } else if (prod.isNew) {
      const keys = Object.keys(prod).filter(k => k !== 'isNew' && k !== 'isDel')
      const placeholders = keys.map(() => '?').join(', ')
      const values = keys.map(k => prod[k])
      const res = await dbReq(`INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders})`, values)
      const newId = prod.id || res.insertId
      if (newId) {
        recalculateIds.push(newId)
      }
    } else {
      const keys = Object.keys(prod).filter(k => k !== 'id' && k !== 'isDel' && k !== 'isNew')
      const setClause = keys.map(k => `${k} = ?`).join(', ')
      const values = keys.map(k => prod[k])
      values.push(prod.id)
      if (keys.length > 0) {
        await dbReq(`UPDATE ${table} SET ${setClause} WHERE id = ?`, values)
      }

      if (keys.some(k => sortAffectingKeys.has(k))) {
        recalculateIds.push(prod.id)
      }
    }
  }

  if (recalculateIds.length > 0) {
    await recalculateProductsSortKey(recalculateIds)
  }

  return true
})
