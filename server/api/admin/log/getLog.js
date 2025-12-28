export default defineEventHandler(async event => {
  //
  const dbLogTable = getLogTableName()
  const query = `SELECT * FROM ${dbLogTable} ORDER BY id DESC`
  const logs = await dbReq(query)
  return logs
})
