export default defineEventHandler(async event => {
  const query = getQuery(event)
  const number = (query.number || '').trim()

  if (!number) {
    return []
  }

  // Find active published products linked to this registry number
  const sql = `
    SELECT p.id, p.name, p.alias, p.price, p.special_price, p.images, p.label
    FROM i_products p
    JOIN i_docs_rstr r ON FIND_IN_SET(r.id, p.reestr_ids)
    WHERE r.number = ? AND p.published = 1
    ORDER BY p.id ASC
  `

  const products = await dbReq(sql, [number])

  return products.map(prod => {
    let image = ''
    if (prod.images) {
      if (Array.isArray(prod.images)) {
        image = prod.images[0]
      } else {
        image = String(prod.images).split(/[\s,]+/)[0] || ''
      }
    }

    return {
      id: prod.id,
      name: prod.name,
      alias: prod.alias,
      price: prod.special_price || prod.price,
      priceRegular: prod.special_price ? prod.price : null,
      image,
      label: prod.label,
    }
  })
})
