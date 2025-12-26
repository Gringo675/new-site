export default defineEventHandler(async event => {
  //
  const query = `TRUNCATE TABLE i_log`
  await dbReq(query)
  return { success: true }
})
