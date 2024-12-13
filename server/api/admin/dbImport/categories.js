import { JSDOM } from 'jsdom'
import prettier from 'prettier'

export default defineEventHandler(async event => {
  // "мягкая" перезапись таблицы i_categories. Не обнуляются значения пропсов (ставятся вручную) и не затираются вручную добавленные категории.

  try {
    const cats = await dbOldReq(
      'SELECT ' +
        'category_id AS old_id, ' +
        'category_parent_id AS parent_id, ' +
        '`name_ru-RU` AS name, ' +
        '`alias_ru-RU` AS alias, ' +
        'category_image AS image, ' +
        '`short_description_ru-RU` AS short_description, ' +
        '`description_ru-RU` AS description, ' +
        // '`meta_title_ru-RU` AS meta_title, ' +
        // '`meta_description_ru-RU` AS meta_description, ' +
        // '`meta_keyword_ru-RU` AS meta_keywords, ' +
        'category_publish AS published ' +
        'FROM instr_jshopping_categories' +
        ' WHERE category_id > 2349' // от призм
      // убрал meta_ столбцы т.к. их нет в новой таблице
    )

    // допиливаем
    for (const cat of cats) {
      cat.id = createNewCategoryID(cat.old_id)
      cat.parent_id = createNewCategoryID(cat.parent_id)
      cat.ordering = cat.id < 100 ? cat.id - 10 : cat.id % 100
      // пробуем распарсить description
      const dom = JSDOM.fragment(cat.description)
      cat.description = dom.querySelector('#description1')?.innerHTML ?? cat.description
      cat.characteristics = dom.querySelector('#description2')?.innerHTML ?? ''
      // делаем красива
      cat.description = await prettier.format(cat.description, { parser: 'html' })
      cat.characteristics = await prettier.format(cat.characteristics, { parser: 'html' })
      cat.short_description = await prettier.format(cat.short_description, { parser: 'html' })
    }

    // собираем запрос
    const fieldsArr = Object.keys(cats[0]) // вытаскиваем названия полей из первого элемента

    const catsValues = cats
      .map(cat => `(${fieldsArr.map(field => `'${prepareString(cat[field])}'`).join(', ')})`)
      .join(', ')

    const query = `INSERT INTO i_categories (${fieldsArr.join(
      ', '
    )}) VALUES ${catsValues} ON DUPLICATE KEY UPDATE ${fieldsArr
      .map(field => `${field} = VALUES(${field})`)
      .join(', ')}`
    // console.log(`query: ${JSON.stringify(query, null, 2)}`)
    await dbReq(query)

    return { status: 'ok' }
  } catch (e) {
    console.error(e)
    return { status: 'error', message: e }
  }
})

function createNewCategoryID(oldID) {
  if (oldID < 1100) return 0
  // раскладываем старый ид на категорию и субкатегорию
  let catID = Math.trunc(oldID / 100)
  let subCatID = oldID - catID * 100
  switch (true) {
    case oldID < 1140:
      catID = 11 // шц
      break
    case oldID === 1140:
      catID = 12 // шр и шрц
      subCatID = 0
      break
    case oldID === 1141:
      catID = 12 // шр и шрц
      subCatID = 1
      break
    case oldID === 1142:
      catID = 12 // шр и шрц
      subCatID = 2
      break
    case oldID === 1150:
      catID = 13 // шг и шгц
      subCatID = 0
      break
    case oldID === 1151:
      catID = 13 // шг и шгц
      subCatID = 1
      break
    case oldID === 1152:
      catID = 13 // шг и шгц
      subCatID = 2
      break
    case oldID === 1160:
      catID = 14 // шзн
      subCatID = 0
      break
    case oldID === 1161:
      catID = 14 // шзн
      subCatID = 1
      break
    case oldID >= 1200 && oldID <= 1304:
      catID = catID + 3 // мк и индикаторы
      break
    case oldID >= 1330 && oldID <= 1335:
      catID = catID + 4 // головки
      subCatID = subCatID - 30
      break
    case oldID >= 1400 && oldID <= 2302:
      catID = catID + 4 // от нутромеров до плит
      break
    case oldID >= 2350 && oldID <= 2352:
      catID = catID + 5 // призмы
      subCatID = subCatID - 50
      break
    default:
      catID = catID + 5 // для остальных
  }

  return subCatID > 0 ? catID * 100 + subCatID : catID
}
