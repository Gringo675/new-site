/**
 * Receives an array of products with updated fields, e.g.:
 * [{"id": 140002, "p2_counting_system": 277}]
 * if 'isNew' -> new product
 * if 'isDel' -> delete product
 */

export default defineEventHandler(async event => {
  const prods = await readBody(event)

  const table = 'i_products'

  for (const prod of prods) {
    if (prod.isDel) {
      await dbReq(`DELETE FROM ${table} WHERE id = ?`, [prod.id])
    } else if (prod.isNew) {
      const keys = Object.keys(prod).filter(k => k !== 'isNew' && k !== 'isDel')
      const placeholders = keys.map(() => '?').join(', ')
      const values = keys.map(k => prod[k])
      await dbReq(`INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders})`, values)
    } else {
      const keys = Object.keys(prod).filter(k => k !== 'id' && k !== 'isDel' && k !== 'isNew')
      const setClause = keys.map(k => `${k} = ?`).join(', ')
      const values = keys.map(k => prod[k])
      values.push(prod.id)
      if (keys.length > 0) {
        await dbReq(`UPDATE ${table} SET ${setClause} WHERE id = ?`, values)
      }
    }
  }

  return true
})
