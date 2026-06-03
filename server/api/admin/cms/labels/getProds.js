export default defineEventHandler(async event => {
  const table = 'i_products2'
  return await dbReq(`SELECT id, name, label FROM ${table} LIMIT 50000`)
})
