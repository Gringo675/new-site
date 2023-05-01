/**
 * API для сохранения измененных свойств. Получает POST массив из объектов. Каждый объект содержит один из ключей:
 * isNew - новое свойство (Insert)
 * isDel - удаленное свойство (Delete)
 * isChanged - измененное свойство (Update)
 */

export default defineEventHandler(async event => {
  await checkToken(event, { adminOnly: true })

  const props = await readBody(event)

  for (const prop of props) {
    let query

    if (prop.isDel) {
      query = `DELETE FROM i_properties WHERE id = ${prop.id}`
    } else if (prop.isNew) {
      query = `INSERT INTO i_properties
                     SET group_id = ${prop.group_id}, name = '${prepareString(prop.name)}', ordering = ${prop.ordering}`
    } else if (prop.isChanged) {
      query = `UPDATE i_properties
                     SET name     = '${prepareString(prop.name)}',
                         ordering = ${prop.ordering}
                     WHERE id = ${prop.id}`
    } else {
      throw createError({ statusCode: 500, statusMessage: "prop object don't have required field!" })
    }
    await dbReq(query)
  }
  return true
})
