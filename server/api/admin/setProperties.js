// todo: move to /cms/

export default defineEventHandler(async event => {
  /**
   * API для сохранения измененных свойств. Получает POST массив из объектов. Каждый объект содержит один из ключей:
   * isNew - новое свойство (Insert)
   * isDel - удаленное свойство (Delete)
   * isChanged - измененное свойство (Update)
   */

  const table = 'i_properties'
  const props = await readBody(event)

  for (const prop of props) {
    let query
    let params = []

    if (prop.isDel) {
      if (await isPropUsing(prop))
        throw createError({
          statusCode: 555,
          statusMessage: `Don't have permission to delete property with id = ${prop.id} because some product or category uses it!`,
        })
      query = `DELETE FROM ${table} WHERE id = ?`
      params = [prop.id]
    } else if (prop.isNew) {
      query = `INSERT INTO ${table}
                      SET group_id = ?, name = ?, ordering = ?`
      params = [prop.group_id, prop.name, prop.ordering]
    } else if (prop.isChanged) {
      query = `UPDATE ${table}
                      SET name     = ?,
                          ordering = ?
                      WHERE id = ?`
      params = [prop.name, prop.ordering, prop.id]
    } else {
      throw createError({ statusCode: 500, statusMessage: "prop object don't have required field!" })
    }
    await dbReq(query, params)
  }
  return true
})

const isPropUsing = async prop => {
  // получает пропс и проверяет, присутствует ли он в какой-либо категории или товаре
  const propsGroups = Array.from(usePrpsGroupsMap().keys())
  const inCats = (await dbReq(`SELECT id FROM i_categories WHERE FIND_IN_SET(?, ${propsGroups[prop.group_id]}) LIMIT 1`, [prop.id])).length === 1
  if (inCats) return true
  const inProducts = (await dbReq(`SELECT id FROM i_products WHERE ${propsGroups[prop.group_id]} = ? LIMIT 1`, [prop.id])).length === 1
  return inProducts
}
