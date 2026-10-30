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

    const values = products.map(p => [Number(p.id), Math.round(Number(p.price) || 0), Math.round(Number(p.old_price) || 0), Math.round(Number(p.vendor_price) || 0), Math.round(Number(p.vendor_old_price) || 0), Math.round(Number(p.verification_price) || 0), Math.round(Number(p.stock) || 0), String(p.vendor_stock ?? ''), p.date_price_changed ? String(p.date_price_changed).slice(0, 10) : today, p.date_vendor_price_changed ? String(p.date_vendor_price_changed).slice(0, 10) : today])

    await withTransaction(async connection => {
      const sql = `
        INSERT INTO i_products 
          (id, price, old_price, vendor_price, vendor_old_price, verification_price, stock, vendor_stock, date_price_changed, date_vendor_price_changed)
        VALUES ?
        ON DUPLICATE KEY UPDATE
          price = VALUES(price),
          old_price = VALUES(old_price),
          vendor_price = VALUES(vendor_price),
          vendor_old_price = VALUES(vendor_old_price),
          verification_price = VALUES(verification_price),
          stock = VALUES(stock),
          vendor_stock = VALUES(vendor_stock),
          date_price_changed = VALUES(date_price_changed),
          date_vendor_price_changed = VALUES(date_vendor_price_changed)
      `
      await connection.query(sql, [values])
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
