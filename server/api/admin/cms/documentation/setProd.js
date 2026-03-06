export default defineEventHandler(async event => {
  //
  const dbTable = 'i_products2'
  const prod = await getFormData(event)
  console.log(`prod: ${JSON.stringify(prod, null, 2)}`)

  // IDs already come as comma-separated strings
  const standart_ids = prod.standart_ids || ''
  const reestr_ids = prod.reestr_ids || ''
  const pasport_ids = prod.pasport_ids || ''

  const query = `UPDATE ${dbTable} SET
    standart_ids = '${standart_ids}',
    reestr_ids = '${reestr_ids}',
    pasport_ids = '${pasport_ids}'
    WHERE id = ${prod.id}`

  console.log(`query: ${JSON.stringify(query, null, 2)}`)
  // await dbReq(query)

  return true
})
