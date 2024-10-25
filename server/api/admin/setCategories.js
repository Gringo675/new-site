export default defineEventHandler(async event => {
  /**
   * API для сохранения измененных категорий. Получает POST объект вида:
   * {
   *     catID: { // объект с измененными полями. Может содержать спец. ключи:
   *         isNew -  метка новой категории,
   *         isDel - метка удаленной категории
   *     }, ...
   * }
   */

  const cats = await readBody(event)

  for (const catID in cats) {
    const cat = cats[catID]
    let query

    if (cat.isDel) {
      // удаляем
      query = `DELETE FROM i_categories WHERE id = ${catID}`
      // console.log(`query: ${query}`);
      await dbReq(query)
    } else if (cat.isNew) {
      // добавляем
      delete cat.isNew
      const params = []
      for (const key in cat) {
        params.push(`${key} = '${prepareString(cat[key])}'`)
      }
      query = `INSERT INTO i_categories SET ${params.join(', ')}`
      // console.log(`query: ${query}`);
      await dbReq(query)
    } else {
      // обновляем
      const params = []
      for (const key in cat) {
        params.push(`${key} = '${prepareString(cat[key])}'`)
      }
      query = `UPDATE i_categories SET ${params.join(', ')}  WHERE id = ${catID}`
      // console.log(`query: ${query}`)
      await dbReq(query)
    }
  }

  return true
})
