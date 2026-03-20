export default defineEventHandler(async event => {
  //
  return await dbReq(`SELECT id, name, image, description FROM i_labels`)
})
