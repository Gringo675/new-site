export default defineEventHandler(async event => {
  //
  const dbTable = 'i_products'
  const prod = await getFormData(event)
  // console.log(`prod: ${JSON.stringify(prod, null, 2)}`)

  const updates = []

  if (prod.standart_ids !== undefined) {
    updates.push(`standart_ids = '${prod.standart_ids || ''}'`)
  }
  if (prod.reestr_ids !== undefined) {
    updates.push(`reestr_ids = '${prod.reestr_ids || ''}'`)
  }
  if (prod.pasport_ids !== undefined) {
    updates.push(`pasport_ids = '${prod.pasport_ids || ''}'`)
  }

  if (!updates.length) return true

  const query = `UPDATE ${dbTable} SET ${updates.join(', ')} WHERE id = ${prod.id}`

  // console.log(`query: ${JSON.stringify(query, null, 2)}`)
  await dbReq(query)

  return true
})
