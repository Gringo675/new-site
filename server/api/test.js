export default defineEventHandler(async event => {
  // await new Promise(resolve => setTimeout(resolve, 300000))
  if (Math.random() < 0.4) throw createError({ statusCode: 499, statusMessage: `Some error from api` })
  return 111
})
