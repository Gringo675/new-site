export default defineEventHandler(async event => {
  // const start = performance.now()

  const { alias } = getQuery(event)
  if (!alias.length) throw createError({ statusCode: 500, statusMessage: 'Parsing alias error!' })

  // получаем категорию
  let query = `SELECT * FROM i_categories WHERE alias = '${alias}'  AND published = 1 LIMIT 1`
  const catData = (await dbReq(query))[0]
  if (catData === undefined) throw createError({ statusCode: 404, statusMessage: 'Page Not Found!!!!' })

  const catActiveProps = [] // для основных категорий будет пустой массив, для подкатегорий добавим ниже

  if (catData.parent_id === 0) {
    // основная категория
    // ищем дочерние категории
    // query = `SELECT name, alias, image FROM i_categories
    //              WHERE parent_id = '${catData.id}' AND published = 1
    //              ORDER BY ordering`
    // catData.childCats = await dbReq(query)
  } else {
    // ищем смежные категории
    // query = `SELECT name, alias, image FROM i_categories
    //              WHERE parent_id = '${catData.parent_id}' AND id != '${catData.id}' AND published = 1
    //              ORDER BY ordering`
    // catData.siblingCats = await dbReq(query)
    // ищем все родительские категории
    // query = `SELECT name, alias FROM i_categories
    //              WHERE id = '${catData.parent_id}'`
    // catData.parentCat = (await dbReq(query))[0]
    // достаем пропсы категории
    for (const key in catData) {
      if (/^p\d_/.test(key) && catData[key] > 0) catActiveProps.push([key, catData[key]]) // [name, value]
    }
  }

  // получаем товары
  const productsCatID = catData.parent_id > 0 ? catData.parent_id : catData.id
  query = `SELECT id, name, alias, price, special_price, images, label_id,
                 p0_brand, p1_type, p2_counting_system, p3_range, p4_size, p5_accuracy, p6_class, p7_feature, p8_pack,
                 standart_ids, reestr_ids, pasport_ids
                 FROM i_products WHERE category_id = '${productsCatID}' 
                 ${catActiveProps.reduce((acc, prop) => {
                   acc += `AND ${prop[0]} = ${prop[1]} `
                   return acc
                 }, '')}
                 AND published = 1`
  const products = await dbReq(query)

  // на основе полученных продуктов создаем фильтр
  const filterGroups = useCatProps(productsCatID)
  const catActivePropsIds = catActiveProps.map(item => item[1]) // только значения
  let allProps = new Set() // набор из всех уникальных id, для запроса в базу

  for (let propKey in filterGroups) {
    if (filterGroups[propKey].disabled) continue
    filterGroups[propKey].valuesIds = new Set()

    products.forEach(product => {
      if (product[propKey] > 0 && !catActivePropsIds.includes(product[propKey])) {
        filterGroups[propKey].valuesIds.add(product[propKey])
        allProps.add(product[propKey])
        if (product.props === undefined) product.props = [] // собираем все пропсы в 1 массив, чтобы легче работать с фильтром
        product.props.push(product[propKey])
      }
      delete product[propKey] // удаляем, больше не понадобится
    })
  }

  // получаем пропсы
  query = `SELECT id, name, ordering
                FROM i_properties 
                WHERE id IN (${Array.from(allProps).join(',')})`
  const propsArr = await dbReq(query)
  const props = {} // для удобства создаем объект из всех пропсов
  propsArr.forEach(prop => {
    props[prop.id] = { name: prop.name, order: prop.ordering }
  })

  // создаем фильтр: отбираем группы в которых больше 1 пропсов, сортируем группы
  const filter = Object.values(filterGroups)
    .filter(fGroup => fGroup.valuesIds?.size > 1)
    .sort((a, b) => a.ordering - b.ordering)
  filter.forEach(fGroup => {
    fGroup.values = []
    fGroup.valuesIds.forEach(id => {
      fGroup.values.push({
        val: id,
        name: props[id].name,
      })
    })
    fGroup.values.sort((a, b) => props[a.val].order - props[b.val].order)
    // удаляем ненужное
    delete fGroup.ordering
    delete fGroup.valuesIds
  })

  // упорядочиваем товары по фильтру
  products.sort((a, b) => {
    for (const fGroup of filter) {
      for (const prop of fGroup.values) {
        const isA = a.props.includes(prop.val)
        const isB = b.props.includes(prop.val)
        if (isA && !isB) return -1
        if (!isA && isB) return 1
      }
    }
    return 0
  })

  const stnds = new Set()
  const rstrs = new Set()
  const pasps = new Set()

  const labels = {} // для кеширования
  const getLabel = async label_id => {
    if (!labels[label_id]) {
      labels[label_id] = (await dbReq(`SELECT name, image FROM i_labels WHERE id = ${label_id} LIMIT 1`))[0] || {}
    }
    return labels[label_id]
  }

  for (const [i, product] of products.entries()) {
    product.order = i
    // проверяем, есть ли на продукт спец. цена
    if (product.special_price > 0) {
      product.priceRegular = product.price
      product.price = product.special_price
    }
    // обрабатываем лейбл
    if (product.label_id > 0) product.label = await getLabel(product.label_id)
    // обрабатываем документацию
    if (product.standart_ids.length) product.standart_ids.split(' ').forEach(stnd => stnds.add(stnd))
    if (product.reestr_ids.length) product.reestr_ids.split(' ').forEach(rstr => rstrs.add(rstr))
    if (product.pasport_ids.length) product.pasport_ids.split(' ').forEach(pasp => pasps.add(pasp))
    // удаляем ненужное
    delete product.pasport_ids
    delete product.reestr_ids
    delete product.standart_ids
    delete product.special_price
    delete product.label_id
  }

  catData.docs = {}
  if (stnds.size) {
    query = `SELECT number, name, file FROM i_docs_stnd
                 WHERE id IN (${Array.from(stnds).join(', ')})`
    catData.docs.stnd = await dbReq(query)
  }
  if (rstrs.size) {
    query = `SELECT number, name, type_si, brand, date, file_ot, file_mp, file_svid FROM i_docs_rstr
                 WHERE id IN (${Array.from(rstrs).join(', ')})`
    catData.docs.rstr = await dbReq(query)
  }
  if (pasps.size) {
    query = `SELECT name, file FROM i_docs_pasp
                 WHERE id IN (${Array.from(pasps).join(', ')})`
    catData.docs.pasp = await dbReq(query)
  }

  // удаляем ненужное
  delete catData.parent_id
  delete catData.published

  // const catPerformance = Math.round(performance.now() - start)
  // cv({ catPerformance })

  return { catData, products, filter }
})
