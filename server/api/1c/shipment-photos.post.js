export default defineEventHandler(async event => {
  // Получение фотографий отгрузки по номеру счета для 1С
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

  const billNumber = body.bill || body.bill_number || query.bill || query.bill_number
  if (!billNumber) {
    throw createError({
      statusCode: 400,
      statusMessage: 'No bill number provided!',
      message: 'No bill number provided!',
    })
  }

  try {
    const rows = await dbReq(
      'SELECT photo FROM i_shipping_photos WHERE bill_number = ? ORDER BY id ASC',
      [billNumber]
    )

    return rows.map(r => r.photo)
  } catch (err) {
    console.error('[1C get_shipment_photos error]:', err)
    throw createError({
      statusCode: 500,
      statusMessage: `Database error: ${err.message}`,
      message: err.message,
    })
  }
})
