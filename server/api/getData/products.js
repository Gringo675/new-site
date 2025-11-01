export default defineEventHandler(async event => {
  // получаем массив id товаров (строкой) или id лейбла товаров

  const { pIds, lId } = getQuery(event)

  if (!pIds && !lId) {
    throw createError({ statusCode: 500, statusMessage: 'Incorrect data!' })
  }

  const query = `SELECT id, name, alias, price, special_price, images, label FROM i_products WHERE ${
    lId ? `label = ${lId}` : `id IN (${pIds})`
  } AND published = 1`
  const products = await dbReq(query)

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
