import https from 'node:https'

const FGIS_HOST = 'fgis.gost.ru'

function doRequest(pathAndQuery, { method = 'GET', body, headers = {}, timeout = 12000, accept } = {}) {
  return new Promise((resolve, reject) => {
    const agent = new https.Agent({
      rejectUnauthorized: false,
    })

    const req = https.request(
      {
        protocol: 'https:',
        hostname: FGIS_HOST,
        path: pathAndQuery,
        method,
        headers: {
          Host: FGIS_HOST,
          'User-Agent': 'curl/8.13.0',
          Accept: accept || 'application/json, */*',
          ...headers,
        },
        servername: FGIS_HOST,
        agent,
        timeout,
      },
      res => {
        const chunks = []
        res.on('data', chunk => chunks.push(chunk))
        res.on('end', () => {
          const buffer = Buffer.concat(chunks)
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve({
              statusCode: res.statusCode,
              headers: res.headers,
              buffer,
              text: () => buffer.toString('utf-8'),
              json: () => JSON.parse(buffer.toString('utf-8')),
            })
          } else {
            const err = new Error(`HTTP ${res.statusCode}: ${buffer.toString('utf-8').slice(0, 300)}`)
            err.statusCode = res.statusCode
            reject(err)
          }
        })
      },
    )

    req.on('timeout', () => {
      req.destroy()
      const err = new Error(`FGIS request timed out after ${timeout}ms`)
      err.code = 'ETIMEDOUT'
      reject(err)
    })

    req.on('error', err => {
      reject(err)
    })

    if (body) {
      req.write(body)
    }
    req.end()
  })
}

/**
 * Performs an HTTPS request to fgis.gost.ru with 1 automatic retry on failure.
 */
export async function fgisRequest(pathAndQuery, options = {}) {
  const timeout = options.timeout || 12000

  try {
    return await doRequest(pathAndQuery, { ...options, timeout })
  } catch (firstErr) {
    console.warn(`[fgisRequest] Attempt 1 failed for ${pathAndQuery} (${firstErr.message}). Retrying in 500ms...`)

    // Wait 500ms before retry
    await new Promise(resolve => setTimeout(resolve, 500))

    try {
      return await doRequest(pathAndQuery, { ...options, timeout })
    } catch (secondErr) {
      const finalErr = new Error(`FGIS request failed after retry: ${secondErr.message} (initial: ${firstErr.message})`)
      finalErr.code = secondErr.code || firstErr.code || 'ECONNFAILED'
      finalErr.statusCode = secondErr.statusCode || firstErr.statusCode
      throw finalErr
    }
  }
}
