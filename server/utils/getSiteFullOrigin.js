// возвращает "реальный" ориджин сайта с учетом baseURL

export default event => {
  // на бегете неправильно определяет протокол
  const url = getRequestURL(event)
  return url.hostname.includes('chelinstrument.ru') ? url.origin.replace(/^http:/, 'https:') : url.origin
}
