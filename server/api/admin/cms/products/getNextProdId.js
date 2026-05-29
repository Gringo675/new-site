export default defineEventHandler(async event => {
  const table = 'i_products2'
  const { cat_id } = getQuery(event)

  if (!cat_id) throw createError({ statusCode: 400, statusMessage: 'cat_id is required' })

  const result = await dbReq(`SELECT MAX(id) as maxId FROM ${table} WHERE category_id = ${cat_id}`)
  const maxId = result[0]?.maxId

  if (maxId !== null && maxId !== undefined) {
    return maxId + 1
  }

  // If no products exist, return cat_id + 0001
  return parseInt(`${cat_id}0001`)
})
