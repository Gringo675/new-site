// Запрещаем индексацию для служебных путей и не-production сборок
export default defineEventHandler(event => {
  //
  const url = event.node.req.url || ''
  const config = useRuntimeConfig(event)

  // Блокируем индексацию для не-production сборок
  if (!config.public.PROD_MODE) {
    setHeader(event, 'X-Robots-Tag', 'noindex, nofollow')
    return
  }

  // Оптимизированный regex для всех неиндексируемых путей
  // Совпадает с: /admin, /search, /user, /cart, /try, /test, /catalog/*?f=*, /api/*
  const noIndexPattern = /^\/(admin|search|user|cart|try|test|api)(?:\/|$)|^\/catalog\/.*\?f=/

  if (noIndexPattern.test(url)) {
    setHeader(event, 'X-Robots-Tag', 'noindex, follow')
  }
})
