export default defineEventHandler(async event => {
  // await new Promise(resolve => setTimeout(resolve, 3000))

  const { id } = getQuery(event)

  if (typeof id !== 'string') throw createError({ statusCode: 505, statusMessage: `Incorrect request!` })

  const query = `SELECT * FROM i_labels WHERE id = ${id} LIMIT 1`
  return (await dbReq(query))[0]
})
