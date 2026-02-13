/**
 * @description Universal proxy endpoint.
 * Accepts only POST requests.
 * Determines the target request method (GET or POST) based on the presence of a 'body' property in the request.
 *
 * @example
 * // To make a GET request
 * $fetch('/api/admin/proxy', {
 *   method: 'POST',
 *   body: {
 *     url: 'https://example.com/data?param=1'
 *   }
 * })
 *
 * @example
 * // To make a POST request
 * $fetch('/api/admin/proxy', {
 *   method: 'POST',
 *   body: {
 *     url: 'https://example.com/api/data',
 *     body: { key: 'value' }
 *   }
 * })
 */
export default defineEventHandler(async event => {
  // Ensure the method is POST
  assertMethod(event, 'POST')

  const { url, body } = await readBody(event)

  if (!url) {
    throw createError({ statusCode: 400, statusMessage: 'Target URL is required in the request body' })
  }

  const fetchOptions = {
    method: body ? 'POST' : 'GET',
  }

  if (body) {
    fetchOptions.body = body
  }

  try {
    return await $fetch(url, fetchOptions)
  } catch (error) {
    console.error(`Error proxying ${fetchOptions.method} request to:`, url, error)
    if (error.response) {
      setResponseStatus(event, error.response.status, error.response.statusText)
      return error.response._data
    }
    throw createError({ statusCode: 500, statusMessage: 'Failed to proxy request' })
  }
})
