export default defineEventHandler(async event => {
  const tokenUser = await checkToken(event)

  return `orders for user with id = ${tokenUser.id} received`
})
