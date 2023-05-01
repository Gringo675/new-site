export default defineEventHandler(async event => {
  const tokenUser = await checkToken(event)

  return true
})
