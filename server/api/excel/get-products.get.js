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

  try {
    const rows = await dbReq(`
      SELECT 
        p.id AS ean, 
        p.name AS name, 
        COALESCE(p.price, 0) AS price, 
        COALESCE(p.stock, 0) AS stock, 
        COALESCE(p.vendor_stock, '') AS vendor_stock, 
        COALESCE(p.vendor_price, 0) AS vendor_price, 
        COALESCE(p.verification_price, 0) AS verification_price, 
        COALESCE(p.old_price, 0) AS old_price, 
        COALESCE(p.vendor_old_price, 0) AS vendor_old_price, 
        DATE_FORMAT(p.date_price_changed, '%Y-%m-%d') AS date_price_changed, 
        DATE_FORMAT(p.date_vendor_price_changed, '%Y-%m-%d') AS date_vendor_price_changed, 
        COALESCE(p.brand_eans, '') AS vendor_ean, 
        IF(LENGTH(TRIM(p.reestr_ids)) > 0, 1, 0) AS in_grsi, 
        COALESCE(p.alias, '') AS alias 
      FROM i_products p 
      WHERE p.published = 1 
      ORDER BY p.id ASC
    `)

    return rows.map(row => ({
      id: row.ean,
      name: row.name,
      price: Number(row.price) || 0,
      stock: Number(row.stock) || 0,
      vendor_stock: String(row.vendor_stock ?? ''),
      vendor_price: Number(row.vendor_price) || 0,
      verification_price: Number(row.verification_price) || 0,
      old_price: Number(row.old_price) || 0,
      vendor_old_price: Number(row.vendor_old_price) || 0,
      date_price_changed: row.date_price_changed || '',
      date_vendor_price_changed: row.date_vendor_price_changed || '',
      vendor_ean: String(row.vendor_ean ?? ''),
      in_grsi: Boolean(row.in_grsi),
      alias: String(row.alias ?? ''),
    }))
  } catch (err) {
    console.error('[Excel get-products error]:', err)
    throw createError({
      statusCode: 500,
      statusMessage: `Database error: ${err.message}`,
      message: err.message,
    })
  }
})
