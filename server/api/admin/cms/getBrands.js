export default defineEventHandler(async event => {
  //
  return await dbReq(`SELECT id, short_name, full_name, image FROM i_brands`)
})
