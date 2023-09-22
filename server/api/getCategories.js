export default defineEventHandler(async () => {
  console.log(`from getCategories`)
  // const query = `SELECT * FROM i_categories WHERE id = 12 OR id = 1201`;
  // const query = `SELECT * FROM i_categories WHERE id IN (12, 13) OR parent_id IN (12, 13) ORDER by id`;
  const query = `SELECT id, parent_id, name, alias, image, ordering 
                   FROM i_categories WHERE published = 1 ORDER by id`

  const rawCats = await dbReq(query)
  // // делаем "правильный" массив из категорий (подкатегории вложены в родительские категории)
  // // rowCats отсортирован по ИД, значит сначала наверняка будут основные категории
  // let cats = {}
  // rowCats.forEach(cat => {
  //   if (cat.parent_id === 0) {
  //     // основная категория
  //     cats[cat.id] = cat
  //   } else {
  //     // "виртуальная" категория, засовываем ее в основную
  //     if (cats[cat.parent_id].children === undefined) cats[cat.parent_id].children = []
  //     cats[cat.parent_id].children.push(cat)
  //   }
  // })
  // cats = Object.values(cats).sort((a, b) => a.ordering - b.ordering) // преобразуем в массив и упорядочиваем
  // cats.forEach(cat => {
  //   // упорядочиваем массив вложенных категорий
  //   if (cat.children !== undefined) cat.children.sort((a, b) => a.ordering - b.ordering)
  // })

  const cats = sortCategories(rawCats)
  // console.log(`cats: ${JSON.stringify(cats, null, 2)}`)
  // удаляем лишнее
  const clearCats = catsArr => {
    console.log(`from clear`)
    for (const cat of catsArr) {
      delete cat.ordering
      if (cat.children !== undefined) sortCategories(cat.children)
    }
  }
  // clearCats(cats) todo: ??????????
  // cats.forEach(cat => {
  //   delete cat.ordering
  //   cat.children?.forEach(cat => delete cat.ordering)
  // })
  // console.log(`cats: ${JSON.stringify(cats, null, 2)}`)
  return cats
})
