/**
 * Receives an array of products with updated fields, e.g.:
 * [{"id": 140002, "p2_counting_system": 277}]
 * if 'isNew' -> new product
 * if 'isDel' -> delete product
 */

export default defineEventHandler(async event => {
  const prods = await readBody(event)

  const table = 'i_products2'

  for (const prod of prods) {
    if (prod.isDel) {
      await dbReq(`DELETE FROM ${table} WHERE id = ${prod.id}`)
    } else if (prod.isNew) {
      const keys = Object.keys(prod).filter(k => k !== 'isNew' && k !== 'isDel')
      const values = keys.map(k => {
        const val = prod[k]
        return typeof val === 'string' ? `'${prepareString(val)}'` : val === null || val === undefined ? 'NULL' : val
      })
      await dbReq(`INSERT INTO ${table} (${keys.join(', ')}) VALUES (${values.join(', ')})`)
    } else {
      const updates = Object.keys(prod)
        .filter(k => k !== 'id' && k !== 'isDel' && k !== 'isNew')
        .map(k => {
          const val = prod[k]
          const formattedVal = typeof val === 'string' ? `'${prepareString(val)}'` : val === null || val === undefined ? 'NULL' : val
          return `${k} = ${formattedVal}`
        })

      if (updates.length > 0) {
        await dbReq(`UPDATE ${table} SET ${updates.join(', ')} WHERE id = ${prod.id}`)
      }
    }
  }

  return true
})
