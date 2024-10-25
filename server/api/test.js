export default defineEventHandler(async event => {
  const text = "s'om''e text`"

  await dbReq(`INSERT INTO i_log SET text = '${prepareString(text)}'`)
  return 'OK'
})
