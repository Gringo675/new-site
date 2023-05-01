/**
 * модуль-заглушка, закрывающий доступ пользователям (пропускает только админов)
 */
export default defineEventHandler(async event => {
  await checkToken(event, {
    adminOnly: true,
  })

  return true
})
