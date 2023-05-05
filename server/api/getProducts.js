export default defineEventHandler(async event => {
  // получаем массив id и отдаем данные по товарам

  const productIds = await readBody(event)

  if (!productIds?.length) throw createError({ statusCode: 500, statusMessage: 'Incorrect data!' })

  const query = `SELECT id, name, alias, price, images FROM i_products WHERE id IN ('${productIds.join(
    ', '
  )}') AND published = 1`
  const products = await dbReq(query)
  cv({ products })
})
