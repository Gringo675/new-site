/*
получение данных через $fetch со спиннером и обработкой ошибок
url - адрес api ресурса
options {
    silent - не показывать loader и не обрабатывать ошибки
    method - get || post,
    payload - данные для передачи с post,
}
 */

export default async (url, options = {}) => {
  if (process.server)
    throw createError({ statusCode: 511, statusMessage: `myFetch should be used only on client side!` })

  // defaults
  options.method = options.method ?? 'get'
  options.payload = options.payload ?? ''
  options.silent = options.silent ?? false

  const fetchOptions = {}

  if (options.method === 'post') {
    fetchOptions.method = 'post'
    fetchOptions.body = options.payload
  }

  if (!options.silent) showLoader()
  let result = null
  while (true) {
    try {
      // @ts-ignore
      result = await $fetch(url, fetchOptions)
      break
    } catch (e) {
      // console.error(`Fetch error! ${e.statusCode}: ${e.statusMessage}`)
      if (options.silent) break
      else if (e.statusCode === 401 || e.statusCode === 403) {
        hideLoader()
        throw createError(e)
      } else {
        const repeat = confirm(
          `Ошибка при обращении к ${url}!\nError ${e.statusCode}: ${e.statusMessage}\nПовторить запрос?`,
        )
        if (!repeat) break
      }
    }
  }
  if (!options.silent) hideLoader()
  return result
}
