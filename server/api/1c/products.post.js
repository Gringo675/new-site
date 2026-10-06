export default defineEventHandler(async event => {
  // Выгрузка товаров для 1С (артикул/old_id, наименование, цены, признак Госреестра)
  const config = useRuntimeConfig(event)
  const validKey = config.ONEC_API_KEY || process.env.ONEC_API_KEY

  let body = {}
  try {
    body = (await readBody(event)) || {}
  } catch {
    body = {}
  }

  const query = getQuery(event) || {}
  const apiKey = body.api_key || query.api_key || getHeader(event, 'x-api-key')

  if (!validKey || apiKey !== validKey) {
    throw createError({
      statusCode: 503,
      statusMessage: 'UNCORRECT PASSWORD!',
      message: 'UNCORRECT PASSWORD!',
    })
  }

  try {
    const rows = await dbReq(`
      SELECT 
        old_id AS ean,
        name,
        price,
        vendor_price,
        verification_price,
        IF(LENGTH(TRIM(reestr_ids)) > 0, 1, 0) AS in_grsi
      FROM i_products
      WHERE published = 1
    `)

    return rows.map(row => [
      row.ean,
      row.name,
      row.price,
      row.vendor_price,
      row.verification_price,
      row.in_grsi ? 1 : 0,
    ])
  } catch (err) {
    console.error('[1C get_all_products error]:', err)
    throw createError({
      statusCode: 500,
      statusMessage: `Database error: ${err.message}`,
      message: err.message,
    })
  }
})
