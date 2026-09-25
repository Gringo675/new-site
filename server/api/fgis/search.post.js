export default defineEventHandler(async event => {
  assertMethod(event, 'POST')
  const body = (await readBody(event)) || {}

  const fgisUrl = 'https://fgis.gost.ru/fundmetrology/cm/xcdb/mit24/get'

  // Escape special characters for Lucene query syntax
  const escapeQuery = str => str.replace(/([+\-!(){}[\]^"~*?:\\/]|&&|\|\|)/g, '\\$1')

  const qValue = Object.entries(body)
    .filter(([key, value]) => ['number', 'title', 'notation', 'manufacturers'].includes(key) && typeof value === 'string' && value.trim())
    .flatMap(([key, value]) =>
      value
        .trim()
        .split(/\s+/)
        .map(word => `${key}:*${escapeQuery(word)}*`),
    )
    .concat('is_actual:true')
    .join(' AND ')

  if (!qValue) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Пожалуйста, заполните хотя бы одно поле для поиска.',
    })
  }

  const rows = Math.min(Math.max(Number(body.rows) || 100, 1), 100)
  const targetUrl = `${fgisUrl}?q=${encodeURIComponent(qValue)}&rows=${rows}`

  let responseData
  try {
    responseData = await $fetch(targetUrl, {
      method: 'GET',
      timeout: 15000,
    })
  } catch (error) {
    console.error('Error querying FGIS Solr:', error.message)
    throw createError({
      statusCode: 502,
      statusMessage: 'Сервер ФГИС АРШИН временно недоступен. Пожалуйста, повторите попытку позже.',
    })
  }

  if (!responseData || !responseData.response || responseData.responseHeader?.status !== 0) {
    throw createError({
      statusCode: 502,
      statusMessage: 'Некорректный ответ от сервера ФГИС АРШИН.',
    })
  }

  const numFound = responseData.response.numFound || 0
  const docs = []
  const emptyValues = [null, undefined, '', 'Нет данных', 'Обозначение отсутствует']

  for (const doc of responseData.response.docs || []) {
    try {
      const item = {
        number: doc.number || '',
        name: doc.title || '',
        type_si: '',
        brand: '',
        date: doc.valid_to || '',
        file_ot: null,
        file_mp: null,
      }

      if (doc.j_notation) {
        try {
          const parsed = JSON.parse(doc.j_notation)
          item.type_si = Array.isArray(parsed) ? parsed.join(', ') : String(parsed)
        } catch {}
      }
      if (emptyValues.includes(item.type_si)) item.type_si = ''

      if (doc.j_manufacturers) {
        try {
          const parsed = JSON.parse(doc.j_manufacturers)
          if (Array.isArray(parsed)) {
            item.brand = parsed
              .map(m => (m.title || '') + (m.country ? ` (${m.country})` : '') + (m.address ? ` ${m.address}` : ''))
              .filter(Boolean)
              .join(', ')
          }
        } catch {}
      }
      if (emptyValues.includes(item.brand)) item.brand = ''

      if (doc.j_specifications) {
        try {
          const specs = JSON.parse(doc.j_specifications)
          if (Array.isArray(specs) && specs.length > 0 && specs[0].doc_uuid) {
            item.file_ot = {
              title: specs[0].filename || 'Описание типа',
              uuid: specs[0].doc_uuid,
            }
          }
        } catch {}
      }

      if (doc.j_methods) {
        try {
          const methods = JSON.parse(doc.j_methods)
          if (Array.isArray(methods) && methods.length > 0 && methods[0].doc_uuid) {
            item.file_mp = {
              title: methods[0].filename || 'Методика поверки',
              uuid: methods[0].doc_uuid,
            }
          }
        } catch {}
      }

      docs.push(item)
    } catch (e) {
      console.error('Error parsing doc item:', e)
    }
  }

  return {
    numFound,
    docs,
  }
})
