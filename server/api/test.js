export default defineEventHandler(async event => {
  const text = "s'om''e text`"

  const response = await dbReq(`INSERT INTO i_log SET text = 'qqq'`)
  console.log(`response: ${JSON.stringify(response, null, 2)}`)
  return 'OK'
})
