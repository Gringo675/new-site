export default defineEventHandler(async event => {
  //
  const dbLogTable = getLogTableName()
  const query = `TRUNCATE TABLE ${dbLogTable}`
  await dbReq(query)
  return { success: true }
})
