export default defineEventHandler(async event => {
  // await new Promise(resolve => setTimeout(resolve, 3000))

  const query = `SELECT number, name, type_si, brand, date, file_ot, file_mp, file_svid FROM i_docs_rstr`

  return await dbReq(query)
})
