export default defineEventHandler(async event => {
  // полностью переписывает таблицу i_properties из старой базы

  try {
    const props = await dbOldReq(
      'SELECT id, field_id AS group_id, `name_ru-RU` AS name, ordering FROM instr_jshopping_products_extra_field_values'
    )
    // отдельным запросом получаем бренды, т.к. в новой базе они являются параметрами
    const brands = await dbOldReq(
      'SELECT manufacturer_id AS id, `name_ru-RU` AS name, ordering FROM instr_jshopping_manufacturers'
    )
    brands.forEach(brand => {
      props.push({ id: brand.id, group_id: 0, name: brand.name, ordering: brand.ordering })
    })
    // group_id в новой и старой базе не совпадают. Сопоставляем их.
    props.forEach(prop => {
      prop.group_id = getGroupID(prop.group_id)
    })

    // собираем запрос
    const propsValues = props
      .map(prop => `(${prop.id}, ${prop.group_id}, '${prepareString(prop.name)}', ${prop.ordering})`)
      .join(', ')
    const query = `INSERT INTO i_properties (id, group_id, name, ordering) VALUES ${propsValues}`

    await dbReq('TRUNCATE i_properties') // удаляет все записи
    await dbReq(query)

    return { status: 'ok' }
  } catch (e) {
    console.error(e)
    return { status: 'error', message: e }
  }
})

function getGroupID(oldValue) {
  // по старому значению field_id возвращает новое group_id
  switch (oldValue) {
    case 7:
      return 2
    case 2:
      return 3
    case 9:
      return 4
    case 3:
      return 5
    case 10:
      return 6
    case 8:
      return 7
    case 6:
      return 8
    default:
      return oldValue
  }
}
