export default defineEventHandler(async event => {
  /**
   * API для сохранения измененных категорий. Получает POST объект вида:
   * {
   *     catID: { // объект с измененными полями. Может содержать спец. ключи:
   *         isNew -  метка добавления новой категории,
   *         isDel - метка удаления категории
   *     }, ...
   * }
   */

  const cats = await readBody(event)
  const addedCats = [] //возвращаем id добавленных категорий для изменения на клиенте

  for (const catID in cats) {
    const cat = cats[catID]
    let query

    if (cat.isDel) {
      // удаляем
      query = `DELETE FROM i_categories WHERE id = ?`
      await dbReq(query, [catID])
    } else if (cat.isNew) {
      // добавляем
      delete cat.isNew
      const keys = Object.keys(cat)
      const setClause = keys.map(key => `${key} = ?`).join(', ')
      const values = keys.map(key => cat[key])
      query = `INSERT INTO i_categories SET ${setClause}`
      const response = await dbReq(query, values)
      addedCats.push({ tempId: catID, realId: response.insertId })
    } else {
      // обновляем
      const keys = Object.keys(cat)
      const setClause = keys.map(key => `${key} = ?`).join(', ')
      const values = keys.map(key => cat[key])
      values.push(catID)
      query = `UPDATE i_categories SET ${setClause} WHERE id = ?`
      await dbReq(query, values)
    }
  }

  return { status: 'ok', addedCats }
})
