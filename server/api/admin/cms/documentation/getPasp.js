export default defineEventHandler(async event => {
  //

  return await dbReq(`SELECT * FROM i_docs_pasp`)
})
