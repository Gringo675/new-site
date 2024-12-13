import prettier from 'prettier'

export default defineEventHandler(async event => {
  // полностью переписывает таблицу i_products из старой базы

  try {
    const prods = await dbOldReq(
      'SELECT ' +
        'products.product_id AS old_id, ' +
        'products.`name_ru-RU` AS name, ' +
        'products.`alias_ru-RU` AS alias, ' +
        'prods_to_cats.category_id AS category_id, ' +
        'products.manufacturer_code AS brand_eans, ' +
        'products.product_price AS price, ' +
        'IFNULL(prices.prev_price, 0) AS old_price, ' +
        'products.product_old_price AS vendor_price, ' +
        'IFNULL(prices.prev_vendor_price, 0) AS vendor_old_price, ' +
        'products.product_buy_price AS verification_price, ' +
        'products.product_quantity AS stock, ' +
        'products.weight_volume_units AS vendor_stock, ' +
        'products.`short_description_ru-RU` AS description, ' +
        'products.`description_ru-RU` AS characteristics, ' +
        'products.product_manufacturer_id AS p0_brand, ' +
        'products.extra_field_1 AS p1_type, ' +
        'products.extra_field_7 AS p2_counting_system, ' +
        'products.extra_field_2 AS p3_range, ' +
        'products.extra_field_9 AS p4_size, ' +
        'products.extra_field_3 AS p5_accuracy, ' +
        'products.extra_field_10 AS p6_class, ' +
        'products.extra_field_8 AS p7_feature, ' +
        'products.extra_field_6 AS p8_pack, ' +
        'IFNULL(docs.stnd_id, "") AS standart_ids, ' +
        'IFNULL(docs.rstr_id, "") AS reestr_ids, ' +
        'IFNULL(docs.pasp_id, "") AS pasport_ids, ' +
        'products.label_id AS label_id, ' +
        // 'products.`meta_title_ru-RU` AS meta_title, ' +
        // 'products.`meta_description_ru-RU` AS meta_description, ' +
        // 'products.`meta_keyword_ru-RU` AS meta_keywords, ' +
        'products.hits AS hits, ' +
        'products.product_publish AS published, ' +
        'products.date_modify AS date_modified, ' +
        'prices.date_price_changed AS date_price_changed, ' +
        'prices.date_vendor_price_changed AS date_vendor_price_changed ' +
        'FROM `instr_jshopping_products` AS products ' +
        'LEFT JOIN `instr_jshopping_products_to_categories` AS prods_to_cats ON products.product_id = prods_to_cats.product_id ' +
        'LEFT JOIN `instr_jshopping_prices` AS prices ON products.product_id = prices.product_id ' +
        'LEFT JOIN `instr_jshopping_docs_products` AS docs ON products.product_id = docs.product_id '
      // 'WHERE products.product_id = 11011201'
      // 'WHERE prods_to_cats.category_id = 1801'
      // 'WHERE TRUNCATE(prods_to_cats.category_id/100, 0) = 11'
      // убрал meta_ столбцы т.к. их нет в новой таблице
    )

    // допиливаем
    const productNewIdHelper = {
      /**
       * служит для генерации новых ID
       * представляет из себя счетчик обращений. Новый ID формируется приращением 1 к предыдущему для данной категории.
       * возвращает значение вида catID*10000+counter (т.е. в одной категории максимально возможно 9 999 продуктов)
       */
      create: function (catID) {
        if (this[catID] === undefined) {
          this[catID] = 1
        } else {
          this[catID]++
        }
        return catID * 10000 + this[catID]
      },
    }
    // получим всю таблицу изображений (так быстрее, чем получать изображения для каждого товара отдельным запросом)
    const images = await dbOldReq(
      'SELECT product_id, image_name AS name, ordering FROM instr_jshopping_products_images'
    )

    for (const prod of prods) {
      // вытаскиваем изображения
      prod.images = images
        .filter(image => image.product_id === prod.old_id)
        .sort((a, b) => a.ordering - b.ordering)
        .map(image => image.name)
        .join(',')

      // даты в строчный вид
      prod.date_modified = setDateObjToString(prod.date_modified)
      prod.date_price_changed = setDateObjToString(prod.date_price_changed)
      prod.date_vendor_price_changed = setDateObjToString(prod.date_vendor_price_changed)

      // обрабатываем категорию
      prod.category_id = getNewCategoryId(prod.category_id)

      // формируем новый ID
      prod.id = productNewIdHelper.create(prod.category_id)

      // делаем красива
      prod.description = await prettier.format(prod.description, { parser: 'html' })
      prod.characteristics = await prettier.format(prod.characteristics, { parser: 'html' })

      // в документации меняем старый разделитель ; на новый ,
      prod.standart_ids = prod.standart_ids.replace(/;/g, ',')
      prod.reestr_ids = prod.reestr_ids.replace(/;/g, ',')
      prod.pasport_ids = prod.pasport_ids.replace(/;/g, ',')
    }

    // собираем запрос
    const fieldsArr = Object.keys(prods[0]) // вытаскиваем названия полей из первого элемента

    const prodsValues = prods
      .map(prod => `(${fieldsArr.map(field => `'${prepareString(prod[field])}'`).join(', ')})`)
      .join(', ')

    const query = `INSERT INTO i_products (${fieldsArr.join(', ')}) VALUES ${prodsValues}`
    // return query

    await dbReq('TRUNCATE i_products') // удаляет все записи
    await dbReq(query)

    return { status: 'ok' }
  } catch (e) {
    console.error(e)
    return { status: 'error', message: e }
  }
})

function getNewCategoryId(oldCategoryId) {
  // на основании старого ID вычисляет новый ID категории

  switch (true) {
    case oldCategoryId < 1141:
      return 11 // шц
    case oldCategoryId === 1141 || oldCategoryId === 1142:
      return 12 // шр и шрц
    case oldCategoryId === 1151 || oldCategoryId === 1152:
      return 13 // шг и шгц
    case oldCategoryId === 1161:
      return 14 // шзн
    case oldCategoryId > 1200 && oldCategoryId < 1330:
      return Math.trunc(oldCategoryId / 100) + 3 // мк и индикаторы
    case oldCategoryId > 1330 && oldCategoryId < 1400:
      return 17 // головки
    case oldCategoryId > 1400 && oldCategoryId < 2350:
      return Math.trunc(oldCategoryId / 100) + 4 // от нутромеров до плит
    case oldCategoryId > 2350 && oldCategoryId < 2400:
      return 28 // призмы
    default:
      return Math.trunc(oldCategoryId / 100) + 5 // для остальных отбрасываем 2 последние цифры и прибавляем 5
  }
}
