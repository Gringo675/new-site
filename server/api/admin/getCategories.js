export default defineEventHandler(async event => {
  // console.log(`from getCategories`);
  // const query = `SELECT * FROM i_categories WHERE id = 12 OR id = 1201`;
  // const query = `SELECT * FROM i_categories WHERE id IN (12, 13) OR parent_id IN (12, 13) ORDER by id`;
  const query = `SELECT * FROM i_categories WHERE id = 11 OR parent_id =11`
  // const query = `SELECT * FROM i_categories`

  const rawCats = await dbReq(query)

  // делаем "правильный" массив из категорий (подкатегории вложены в родительские категории)
  return sortCategories(rawCats)
})
