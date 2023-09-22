export default (rawCats, baseParentId = 0) => {
  /**
   * Функция получает одномерный массив из категорий, распихивает их по родителям и сортирует.
   * baseParentId - id общей для всех категории. Для товаров это будет category_id, для списка всех категорий = 0.
   */
  const getChildCats = parentId => {
    const children = rawCats.filter(rawCat => rawCat.parent_id === parentId)
    if (children.length) return children.sort((a, b) => a.ordering - b.ordering)
  }

  const cats = getChildCats(baseParentId) // main cats
  for (const cat of cats) {
    cat.children = getChildCats(cat.id) // sub-cats
    if (baseParentId === 0 && cat.children !== undefined) {
      for (const subCat of cat.children) {
        subCat.children = getChildCats(subCat.id) // sub-sub-cats
      }
    }
  }
  return cats
}
