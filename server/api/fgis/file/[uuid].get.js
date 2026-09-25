export default defineEventHandler(async event => {
  const uuid = getRouterParam(event, 'uuid')

  if (!uuid || !/^[a-zA-Z0-9_\-]+$/.test(uuid)) {
    throw createError({ statusCode: 400, statusMessage: 'Некорректный идентификатор документа' })
  }

  const path = `/fundmetrology/cm/iaux/docs/${uuid}`

  let data
  try {
    const res = await fgisRequest(path, { timeout: 25000 })
    data = res.json()
  } catch (error) {
    console.error('Error fetching file from FGIS:', error.message)
    $fetch('/api/log/setText', {
      method: 'POST',
      body: {
        text: `[FGIS FILE 502] UUID: "${uuid}" | Details: ${error.message} | Code: ${error.code || 'N/A'}`,
      },
    }).catch(() => {})

    throw createError({
      statusCode: 502,
      statusMessage: 'Не удалось загрузить файл из ФГИС РСТ.',
      message: 'Не удалось загрузить файл из ФГИС РСТ.',
      data: {
        debug: error.message,
      },
    })
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
