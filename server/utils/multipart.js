/**
 * Надежный парсер multipart/form-data, устойчивый к Google Apps Script (UrlFetchApp)
 * и клиентам, передающим boundary в кавычках (например boundary="------------------..."),
 * из-за чего стандартный readMultipartFormData в h3/Nitro возвращает пустой результат.
 */
export async function readSafeMultipartFormData(event) {
  // 1. Пробуем стандартный метод H3
  try {
    const standard = await readMultipartFormData(event)
    if (standard && standard.length > 0) {
      return standard
    }
  } catch {
    // В случае сбоя переходим к fallback-парсеру
  }

  // 2. Fallback для клиентов с boundary в кавычках или нестандартными заголовками
  const contentType = getHeader(event, 'content-type') || ''
  if (!contentType.toLowerCase().includes('multipart/form-data')) {
    return null
  }

  const match = contentType.match(/boundary=(?:"([^"]+)"|([^;]+))/i)
  const boundary = (match?.[1] || match?.[2] || '').trim().replace(/^["']|["']$/g, '')
  if (!boundary) {
    return null
  }

  const rawBody = await readRawBody(event, false)
  if (!rawBody || !rawBody.length) {
    return null
  }

  return parseMultipartBuffer(rawBody, boundary)
}

function parseMultipartBuffer(multipartBodyBuffer, boundary) {
  let lastline = ''
  let state = 0 // 0: INIT, 1: READING_HEADERS, 2: READING_DATA, 3: READING_PART_SEPARATOR
  let buffer = []
  const allParts = []
  let currentPartHeaders = []

  for (let i = 0; i < multipartBodyBuffer.length; i++) {
    const prevByte = i > 0 ? multipartBodyBuffer[i - 1] : null
    const currByte = multipartBodyBuffer[i]
    const newLineChar = currByte === 10 || currByte === 13

    if (!newLineChar) {
      lastline += String.fromCodePoint(currByte)
    }

    const newLineDetected = currByte === 10 && prevByte === 13

    if (state === 0 && newLineDetected) {
      if ('--' + boundary === lastline) {
        state = 1
      }
      lastline = ''
    } else if (state === 1 && newLineDetected) {
      if (lastline.length > 0) {
        const idx = lastline.indexOf(':')
        if (idx > 0) {
          const name = lastline.slice(0, idx).toLowerCase()
          const value = lastline.slice(idx + 1).trim()
          currentPartHeaders.push([name, value])
        }
      } else {
        state = 2
        buffer = []
      }
      lastline = ''
    } else if (state === 2) {
      if (lastline.length > boundary.length + 4) {
        lastline = ''
      }
      if ('--' + boundary === lastline) {
        const j = buffer.length - lastline.length
        const part = buffer.slice(0, j - 1)
        allParts.push(processPart(part, currentPartHeaders))
        buffer = []
        currentPartHeaders = []
        lastline = ''
        state = 3
      } else {
        buffer.push(currByte)
      }
      if (newLineDetected) {
        lastline = ''
      }
    } else if (state === 3 && newLineDetected) {
      state = 1
    }
  }

  return allParts
}

function processPart(data, headers) {
  const dataObj = {}
  const contentDispositionHeader = headers.find(h => h[0] === 'content-disposition')?.[1] || ''

  for (const item of contentDispositionHeader.split(';')) {
    const s = item.split('=')
    if (s.length !== 2) continue
    const key = (s[0] || '').trim()
    if (key === 'name' || key === 'filename') {
      const value = (s[1] || '').trim().replace(/^["']|["']$/g, '')
      dataObj[key] = Buffer.from(value, 'latin1').toString('utf8')
    }
  }

  const contentType = headers.find(h => h[0] === 'content-type')?.[1] || ''
  if (contentType) {
    dataObj.type = contentType
  }

  dataObj.data = Buffer.from(data)
  return dataObj
}

export default readSafeMultipartFormData
