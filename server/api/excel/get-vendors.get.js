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
    const vendors = [
      { table: 'i_vendor_chiz', name: 'ЧИЗ' },
      { table: 'i_vendor_kiber', name: 'КИБЕР' },
      { table: 'i_vendor_kirov', name: 'КИРОВИНСТРУМЕНТ' },
      { table: 'i_vendor_stiz', name: 'СТИЗ' },
    ]

    const allItems = []

    for (const v of vendors) {
      try {
        const rows = await dbReq(`
          SELECT 
            COALESCE(ean, '') AS ean,
            COALESCE(name, '') AS name,
            COALESCE(stock, '') AS stock,
            COALESCE(price, 0) AS price,
            COALESCE(d_price, 0) AS d_price
          FROM \`${v.table}\`
        `)

        for (const r of rows) {
          allItems.push({
            ean: String(r.ean ?? ''),
            name: String(r.name ?? ''),
            vendor: v.name,
            stock: String(r.stock ?? ''),
            price: Number(r.price) || 0,
            d_price: Number(r.d_price) || 0,
          })
        }
      } catch (tableErr) {
        console.error(`[Excel get-vendors error reading ${v.table}]:`, tableErr.message)
      }
    }

    return allItems
  } catch (err) {
    console.error('[Excel get-vendors error]:', err)
    throw createError({
      statusCode: 500,
      statusMessage: `Database error: ${err.message}`,
      message: err.message,
    })
  }
})
