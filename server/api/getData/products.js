export default defineEventHandler(async event => {
  // получаем массив id товаров (строкой) или id лейбла товаров

  const { pIds, lId } = getQuery(event)

  if (!pIds && !lId) {
    throw createError({ statusCode: 500, statusMessage: 'Incorrect data!' })
  }

  let query
  let params = []
  if (lId) {
    query = `SELECT id, name, alias, price, special_price, images, label FROM i_products WHERE label = ? AND published = 1`
    params = [lId]
  } else {
    const ids = pIds.split(',').map(Number)
    const placeholders = ids.map(() => '?').join(',')
    query = `SELECT id, name, alias, price, special_price, images, label FROM i_products WHERE id IN (${placeholders}) AND published = 1`
    params = ids
  }
  const products = await dbReq(query, params)

  if (!products.length) return []

  products.forEach(product => {
    // Берем только первое изображение
    const match = product.images?.match(/^[^,]+/)
    product.image = match ? match[0] : ''
    delete product.images

    // Проверяем наличие спец.цены
    if (product.special_price && product.special_price > 0) {
      product.priceRegular = product.price
      product.price = product.special_price
    }
    delete product.special_price
  })

  return products
})
