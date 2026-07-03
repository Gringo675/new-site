export default defineEventHandler(async event => {
  // полностью переписывает таблицу i_brands из старой базы

  try {
    const brands = await dbOldReq('SELECT `name_ru-RU`, `short_description_ru-RU`, manufacturer_logo FROM instr_jshopping_manufacturers')

    const placeholders = brands.map(() => '(?, ?, ?)').join(', ')
    const values = brands.flatMap(brand => [brand['name_ru-RU'], brand['short_description_ru-RU'], brand['manufacturer_logo']])
    const query = `INSERT INTO i_brands (short_name, full_name, image) VALUES ${placeholders}`

    await dbReq('TRUNCATE i_brands') // удаляет все записи
    await dbReq(query, values)

    return { status: 'ok' }
  } catch (e) {
    console.error(e)
    return { status: 'error', message: e }
  }
})
