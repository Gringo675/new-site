export default defineEventHandler(async event => {
  //
  const dbTable = 'i_products'
  const prod = await getFormData(event)
  // console.log(`prod: ${JSON.stringify(prod, null, 2)}`)

  const updates = []
  const params = []

  if (prod.standart_ids !== undefined) {
    updates.push(`standart_ids = ?`)
    params.push(prod.standart_ids || '')
  }
  if (prod.reestr_ids !== undefined) {
    updates.push(`reestr_ids = ?`)
    params.push(prod.reestr_ids || '')
  }
  if (prod.pasport_ids !== undefined) {
    updates.push(`pasport_ids = ?`)
    params.push(prod.pasport_ids || '')
  }

  if (!updates.length) return true

  const query = `UPDATE ${dbTable} SET ${updates.join(', ')} WHERE id = ?`
  params.push(prod.id)

  // console.log(`query: ${JSON.stringify(query, null, 2)}`)
  await dbReq(query, params)

  return true
})
