export default defineEventHandler(async event => {
  const prods = await readBody(event)
  const table = 'i_products'

  for (const prod of prods) {
    if (prod.id && prod.label !== undefined) {
      const val = prod.label
      await dbReq(`UPDATE ${table} SET label = ? WHERE id = ?`, [val, prod.id])
    }
  }

  return true
})
