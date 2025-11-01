export default defineEventHandler(async () => {
  //
  const query = `SELECT id, parent_id, name, alias, ordering 
                   FROM i_categories WHERE published = 1 ORDER by id`

  const rawCats = await dbReq(query)

  const cats = sortCategories(rawCats)

  // удаляем лишнее
  const clearCats = catsArr => {
    for (const cat of catsArr) {
      delete cat.ordering
      if (cat.children !== undefined) clearCats(cat.children)
    }
  }
  clearCats(cats)

  return cats
})
