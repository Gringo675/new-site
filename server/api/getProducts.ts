export default defineEventHandler(async event => {
  // получаем массив id или лейбл товаров. На данном этапе мне этого достаточно

  interface ProductsRequest {
    productIds?: number[]
    labelId?: number
  }
  interface Product {
    id: number
    name: string
    alias: string
    price: number
    special_price?: number
    images?: string
    labelId: number
    image?: string
    priceRegular?: number
  }

  const productsRequest: ProductsRequest = await readBody(event)

  const hasProductIds = Array.isArray(productsRequest.productIds) && productsRequest.productIds.length > 0
  const hasLabelId = typeof productsRequest.labelId === 'number' && productsRequest.labelId > 0

  if (!(hasProductIds || hasLabelId)) {
    throw createError({ statusCode: 500, statusMessage: 'Incorrect data!' })
  }

  const query = `SELECT id, name, alias, price, special_price, images, label FROM i_products WHERE ${
    hasLabelId ? `label = ${productsRequest.labelId}` : `id IN (${productsRequest.productIds!.join(', ')})`
  } AND published = 1`
  const products = (await dbReq(query)) as Product[]

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
