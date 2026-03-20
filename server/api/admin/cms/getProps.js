export default defineEventHandler(async event => {
  //
  return await dbReq(`SELECT id, group_id, name, ordering FROM i_properties`)
})
