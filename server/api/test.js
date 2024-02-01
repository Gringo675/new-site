export default defineEventHandler(async event => {
  throw createError({ statusCode: 482, statusMessage: `Some error` })
  return 111
})
