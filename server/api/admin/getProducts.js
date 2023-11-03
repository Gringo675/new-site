export default defineEventHandler(async event => {
  await checkToken(event, { adminOnly: true })

  const result = {} // возвращаемый объект
  // получаем все товары
  let query = `SELECT id, name, alias, category_id, brand_eans, images, description, characteristics, p0_brand, p1_type, p2_counting_system, p3_range, p4_size, p5_accuracy, p6_class, p7_feature, p8_pack, standart_ids, reestr_ids, pasport_ids, label_id, published FROM i_products`
  result.products = sortCategories(await dbReq(query))

  // получаем все категории
  query = `SELECT name, id, parent_id, p0_brand, p1_type, p2_counting_system, p3_range, p4_size, p5_accuracy, p6_class, p7_feature, p8_pack, ordering FROM i_categories WHERE published = 1`
  result.cats = sortCategories(await dbReq(query))

  // получаем всю документацию
  query = `SELECT name, id, parent_id, p0_brand, p1_type, p2_counting_system, p3_range, p4_size, p5_accuracy, p6_class, p7_feature, p8_pack, ordering FROM i_categories WHERE published = 1`
  // получаем лейблы

  return result
})
