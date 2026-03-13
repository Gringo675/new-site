export default defineEventHandler(async event => {
  //
  const { cat_id } = getQuery(event)
  return await dbReq(
    `SELECT id, name, alias, standart_ids, reestr_ids, pasport_ids  FROM i_products WHERE category_id = ${cat_id}`,
  )
})
