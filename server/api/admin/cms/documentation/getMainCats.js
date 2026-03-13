export default defineEventHandler(async event => {
  //
  return await dbReq(`SELECT id AS value, name AS label FROM i_categories WHERE parent_id = 0`)
})
