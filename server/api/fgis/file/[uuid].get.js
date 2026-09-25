export default defineEventHandler(async event => {
  const uuid = getRouterParam(event, 'uuid')

  if (!uuid || !/^[a-zA-Z0-9_\-]+$/.test(uuid)) {
    throw createError({ statusCode: 400, statusMessage: 'Некорректный идентификатор документа' })
  }

  const targetUrl = `https://fgis.gost.ru/fundmetrology/cm/iaux/docs/${uuid}`

  let data
  try {
    data = await $fetch(targetUrl, {
      method: 'GET',
      timeout: 25000,
    })
  } catch (error) {
    console.error('Error fetching file from FGIS:', error.message)
    throw createError({ statusCode: 502, statusMessage: 'Не удалось загрузить файл из ФГИС' })
  }

  if (!data || !data.doc) {
    throw createError({ statusCode: 404, statusMessage: 'Файл не найден во ФГИС' })
  }

  const buffer = Buffer.from(data.doc, 'base64')
  const filename = data.filename || `doc_${uuid}.pdf`
  const mimetype = data.mimetype || 'application/pdf'

  setResponseHeaders(event, {
    'Content-Type': mimetype,
    'Content-Disposition': `inline; filename="${encodeURIComponent(filename)}"`,
    'Content-Length': buffer.length,
    'Cache-Control': 'public, max-age=86400',
  })

  return buffer
})
