export default defineEventHandler(async event => {
  //
  const query = `SELECT * FROM i_log ORDER BY id DESC`
  const logs = await dbReq(query)
  return logs
})
