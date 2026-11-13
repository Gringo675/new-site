export default defineEventHandler(async event => {
  const config = useRuntimeConfig(event)
  const validKey = config.EXCEL_API_KEY || process.env.EXCEL_API_KEY

  const authHeader = getHeader(event, 'authorization') || ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : null

  if (!validKey || token !== validKey) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized: Invalid API Key',
      message: 'Unauthorized: Invalid API Key',
    })
  }

  let body = {}
  try {
    body = (await readBody(event)) || {}
  } catch {
    body = {}
  }

  const products = Array.isArray(body) ? body : body.products || []

  if (!products.length) {
    return {
      success: true,
      updatedCount: 0,
      searchIndexRefreshed: false,
      message: 'No products to update',
    }
  }

  try {
    const today = new Date().toISOString().slice(0, 10)

    await withTransaction(async connection => {
      const updateSql = `
        UPDATE i_products 
        SET price = ?, old_price = ?, verification_price = ?, stock = ?, date_price_changed = ?
        WHERE id = ?
      `
      for (const p of products) {
        const id = Number(p.id)
        const price = Math.round(Number(p.price) || 0)
        const oldPrice = Math.round(Number(p.old_price) || 0)
        const verificationPrice = Math.round(Number(p.verification_price) || 0)
        const stock = Math.round(Number(p.stock) || 0)
        const datePriceChanged = p.date_price_changed ? String(p.date_price_changed).slice(0, 10) : today

        await connection.execute(updateSql, [price, oldPrice, verificationPrice, stock, datePriceChanged, id])
      }
    })

    // Обновляем поисковый индекс на сайте после изменения цен
    let searchRefreshed = false
    try {
      await refreshSearchIndex()
      searchRefreshed = true
    } catch (indexErr) {
      console.error('[Excel update-products] refreshSearchIndex error:', indexErr)
    }

    return {
      success: true,
      updatedCount: products.length,
      searchIndexRefreshed: searchRefreshed,
    }
  } catch (err) {
    console.error('[Excel update-products error]:', err)
    throw createError({
      statusCode: 500,
      statusMessage: `Database error: ${err.message}`,
      message: err.message,
    })
  }
})
