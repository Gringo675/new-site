export default defineEventHandler(async event => {
  // функция по алиасу отдает информацию о товаре
  // const start = Date.now()

  const alias = getRouterParam(event, 'p_alias')
  if (!alias.length) throw createError({ statusCode: 500, statusMessage: 'Incorrect URI!' })
  // console.log(`API alias: ${alias}`);

  let query = `SELECT * FROM i_products WHERE alias = '${alias}' AND published = 1`
  const productData = (await dbReq(query))[0]
  if (productData === undefined) throw createError({ statusCode: 404, statusMessage: 'Page Not Found!' })
  // console.log(`productData: ${JSON.stringify(productData)}`);

  const propsGroups = usePropsGroups()
  // отбираем под- и под-под-категории, к которым относится данный продукт
  query = `SELECT id FROM i_categories
            WHERE (parent_id = ${productData.category_id} OR
            parent_id IN (SELECT id FROM i_categories WHERE parent_id = ${productData.category_id}))
            ${propsGroups.map(prop => `AND (${prop} = '' OR FIND_IN_SET('${productData[prop]}', ${prop})) `).join('')}
            AND published = 1`
  // убрал под-под-категории
  // query = `SELECT id FROM i_categories
  //           WHERE parent_id = ${productData.category_id}
  //           ${propsGroups.map(prop => `AND (${prop} = '' OR FIND_IN_SET('${productData[prop]}', ${prop})) `).join('')}
  //           AND published = 1`

  productData.subCatsId = (await dbReq(query)).map(item => item.id)

  // отбираем related prods (из той же категории и максимально совпадающие по параметрам)
  query = `SELECT id, name, alias, price, special_price, images, label, ${propsGroups.join()} 
                 FROM i_products 
                 WHERE category_id = ${productData.category_id} AND id != ${productData.id} AND published = 1`
  const related = await dbReq(query)
  related.forEach(rel => {
    rel.points = 0
    propsGroups.forEach(prop => {
      if (rel[prop] === productData[prop]) ++rel.points
    })
  })
  related.sort((a, b) => b.points - a.points)
  productData.relatedProds = []
  const ceiling = related.length > 8 ? 8 : related.length // возвращаем не больше 8
  for (let i = 0; i < ceiling; i++) {
    productData.relatedProds.push({
      id: related[i].id,
      name: related[i].name,
      alias: related[i].alias,
      price: related[i].special_price > 0 ? related[i].special_price : related[i].price,
      priceRegular: related[i].special_price > 0 ? related[i].price : undefined,
      label: related[i].label,
      image: related[i].images.match(/^[^,]+/)[0], // берем только первое изображение
    })
  }

  // формируем характеристики
  productData.props = []
  propsGroups.forEach(prop => {
    if (productData[prop] > 0)
      productData.props.push({
        name: prop,
        val: productData[prop],
      })
  })
  query = `SELECT id, name
                 FROM i_properties 
                 WHERE id IN (${productData.props.map(prop => prop.val).join()})`
  const decipherP = await dbReq(query)
  const catProps = useCatProps(productData.category_id)
  let brandIndex // нужно вытащить из характеристик производителя в отдельное свойство
  productData.props.forEach((prop, i) => {
    if (prop.name === 'p0_brand') brandIndex = i
    prop.val = decipherP.find(item => item.id === prop.val)?.name
    prop.ordering = catProps[prop.name].ordering
    prop.name = catProps[prop.name].name
  })
  productData.brand = {
    shortName: productData.props[brandIndex].val,
  }
  productData.props.splice(brandIndex, 1) // удаляем бренд из характеристик
  productData.props.sort((a, b) => a.ordering - b.ordering)
  productData.props.forEach(prop => delete prop.ordering)

  // получаем brand
  query = `SELECT full_name, image
                 FROM i_brands 
                 WHERE short_name = '${productData.brand.shortName}' LIMIT 1`
  const brand = (await dbReq(query))[0]
  productData.brand.fullName = brand.full_name
  productData.brand.image = brand.image

  // получаем документацию и добавляем сведенья в пропсы
  productData.docs = {}
  // для правильного порядка в пропсах важно сначала обработать реестры
  if (productData.reestr_ids.length) {
    query = `SELECT number, name, type_si, brand, date, file_ot, file_mp, file_svid FROM i_docs_rstr
                 WHERE id IN (${productData.reestr_ids})`
    productData.docs.rstr = await dbReq(query)
    productData.props.push({
      name: 'Можно поверить',
      val: 'Да',
    })
    if (productData.docs.rstr.length) {
      productData.props.unshift({
        name: 'Госреестр',
        val: productData.docs.rstr.map(item => item.number).join(', '),
      })
    }
  }
  if (productData.standart_ids.length) {
    query = `SELECT number, name, file FROM i_docs_stnd
                 WHERE id IN (${productData.standart_ids})`
    productData.docs.stnd = await dbReq(query)
    if (productData.docs.stnd.length) {
      productData.props.unshift({
        name: 'Стандарт',
        val: productData.docs.stnd.map(item => item.number).join(', '),
      })
    }
  }
  if (productData.pasport_ids.length) {
    query = `SELECT name, file FROM i_docs_pasp
                 WHERE id IN (${productData.pasport_ids})`
    productData.docs.pasp = await dbReq(query)
  }

  productData.images = productData.images.split(',') // изображения из строки в массив

  // проверяем, есть ли на продукт спец. цена
  if (productData.special_price > 0) {
    productData.priceRegular = productData.price
    productData.price = productData.special_price
  }

  // удаляем ненужное
  const toDelete = [
    'old_id',
    'brand_eans',
    'special_price',
    'old_price',
    'vendor_price',
    'vendor_old_price',
    'verification_price',
    'stock',
    'vendor_stock',
    'hits',
    'published',
    'date_modified',
    'date_price_changed',
    'date_vendor_price_changed',
    'standart_ids',
    'reestr_ids',
    'pasport_ids',
  ]
  toDelete.forEach(name => delete productData[name])
  propsGroups.forEach(name => delete productData[name])

  // console.log(`deltaF: ${Date.now() - start}`)

  return productData
})
