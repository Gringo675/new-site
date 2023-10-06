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
      if (await isPropUsing(prop.id))
        throw createError({
          statusCode: 555,
          statusMessage: `Don't have permission to delete property with id = ${prop.id} because some product or category uses it!`,
        })
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

const isPropUsing = async propId => {
  // получает id пропса и проверяет, присутствует ли он в какой-либо категории или товаре

  const propGroups = [
    'p0_brand',
    'p1_type',
    'p2_counting_system',
    'p3_range',
    'p4_size',
    'p5_accuracy',
    'p6_class',
    'p7_feature',
    'p8_pack',
  ]
  const queryTemplate = `SELECT id FROM TABLE_NAME WHERE ${propGroups
    .map(pGroup => `${pGroup} = ${propId}`)
    .join(' OR ')}`
  const inCats = (await dbReq(queryTemplate.replace('TABLE_NAME', 'i_categories'))).length > 0
  if (inCats) return true
  const inProducts = (await dbReq(queryTemplate.replace('TABLE_NAME', 'i_products'))).length > 0
  return inProducts
}
