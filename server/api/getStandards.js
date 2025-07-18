export default defineEventHandler(async event => {
  // await new Promise(resolve => setTimeout(resolve, 3000))

  const query = `SELECT number, name, file FROM i_docs_stnd`
  return await dbReq(query)
})
