// Запрещаем индексацию API-эндпоинтов, но разрешаем доступ для рендеринга
export default defineEventHandler((event) => {
  const url = event.node.req.url || ''
  
  // Для всех /api/* добавляем X-Robots-Tag: noindex
  if (url.startsWith('/api/')) {
    setHeader(event, 'X-Robots-Tag', 'noindex, follow')
  }
})
