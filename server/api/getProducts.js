export default defineEventHandler(async event => {
  // получаем массив id и отдаем данные по товарам
  await new Promise(resolve => setTimeout(resolve, 10000))

  const productIds = await readBody(event)
  if (!productIds?.length) throw createError({ statusCode: 500, statusMessage: 'Incorrect data!' })

  const query = `SELECT id, name, alias, price, special_price, images FROM i_products WHERE id IN (${productIds.join(
    ', ',
  )}) AND published = 1`

  const products = await dbReq(query)
  if (!Array.isArray(products)) return false

  products.forEach(product => {
    // берем только первое изображение
    product.image = product.images.match(/^[^,]+/)[0]
    delete product.images
    // проверяем наличие спец.цены
    if (product.special_price > 0) {
      product.priceRegular = product.price
      product.price = product.special_price
    }
    delete product.special_price
  })

  return products
})
