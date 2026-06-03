export default defineEventHandler(async event => {
  const prods = await readBody(event)
  const table = 'i_products2'

  for (const prod of prods) {
    if (prod.id && prod.label !== undefined) {
      const val = prod.label
      const formattedVal = val === null || val === undefined ? 'NULL' : val
      await dbReq(`UPDATE ${table} SET label = ${formattedVal} WHERE id = ${prod.id}`)
    }
  }

  return true
})
