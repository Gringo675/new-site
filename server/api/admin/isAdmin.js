/**
 * модуль-заглушка, закрывающий доступ пользователям (пропускает только админов)
 */
export default defineEventHandler(async event => {
  // проверка осуществляется в middleware/adminOnly.js

  return true
})
