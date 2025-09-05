// возвращает "реальный" ориджин сайта с учетом baseURL

export default event => {
  const url = getRequestURL(event)
  const host = url.hostname
  let baseURL = useRuntimeConfig().app.baseURL
  if (baseURL[baseURL.length - 1] !== '/') baseURL += '/' // гарантируем слеш в конце
  const origin = host === 'chelinstrument.ru' ? 'https://chelinstrument.ru' : url.origin // на бегете неправильно определяет протокол
  return origin + baseURL
}
