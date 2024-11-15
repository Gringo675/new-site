export default reactive({
  cats: [],
  changedCats: {},
  draggingCatIndexes: [],
  async getCats() {
    this.cats = await myFetch('/api/admin/getCategories')
    this.changedCats = {}
  },
  getCat(indexes) {
    switch (indexes.length) {
      case 1:
        return this.cats[indexes[0]]
      case 2:
        return this.cats[indexes[0]].children[indexes[1]]
      case 3:
        return this.cats[indexes[0]].children[indexes[1]].children[indexes[2]]
    }
  },
  handleChanges(catID, key, newContent) {
    if (this.changedCats[catID] === undefined) this.changedCats[catID] = {}
    this.changedCats[catID][key] = newContent
  },
  async saveChanges() {
    if (!Object.keys(this.changedCats).length) return

    const success = await myFetch('/api/admin/setCategories', {
      method: 'post',
      payload: this.changedCats,
    })
    if (success) {
      this.changedCats = {}
      // this.cats.length = 0
      // this.getCats()
      showNotice({ title: `Изменения сохранены!`, type: 'success' })
    }
  },
  addCat(indexes, options = {}) {
    /**
     * У функции три варианта добавления категории:
     * Добавление - новая пустая категория вставляется на одном уровне с таргет-категорией (рядом).
     * Копирование - options.copy - таргет-категория копируется рядом.
     * Добавление подкатегории - options.subcat - добавляет пустую подкатегорию для таргет-категории (в конец)
     */

    options.copy = options.copy ?? false
    options.subcat = options.subcat ?? false

    const tCat = this.getCat(indexes)
    let tArray, parentId // куда будем вставлять
    if (options.subcat) {
      parentId = tCat.id
      if (tCat.children === undefined) tCat.children = []
      tArray = tCat.children
    } else {
      if (indexes.length === 1) {
        parentId = 0
        tArray = this.cats
      } else {
        const parentCat = this.getCat(indexes.slice(0, -1))
        parentId = parentCat.id
        tArray = parentCat.children
      }
    }

    const newCat = options.copy ? JSON.parse(JSON.stringify(tCat)) : {}
    delete newCat.children // при копировании дети не копируются
    newCat.id = Date.now() // temp id
    newCat.parent_id = parentId
    newCat.published = 1
    if (options.subcat) {
      // наследуем пропсы от родительской категории
      for (const key in tCat) {
        if (/^p\d_/.test(key) && tCat[key] > 0) newCat[key] = tCat[key]
      }
      // вставляем в конец
      tArray.push(newCat)
    } else {
      // вставляем рядом
      tArray.splice(indexes[indexes.length - 1] + 1, 0, newCat)
    }
    // сохраняем изменения в спец. объекте
    this.changedCats[newCat.id] = JSON.parse(JSON.stringify(newCat))
    this.changedCats[newCat.id].isNew = true
    delete this.changedCats[newCat.id].id // убираем дублирование ID

    // обрабатываем новый порядок категорий
    this.createNewCatsOrder(tArray)
  },
  deleteCat(indexes) {
    const tCat = this.getCat(indexes)
    const tArray = indexes.length === 1 ? this.cats : this.getCat(indexes.slice(0, -1)).children

    if (this.changedCats[tCat.id]?.isNew) {
      // если до этого добавили эту категорию
      delete this.changedCats[tCat.id] // просто удаляем
    } else {
      this.changedCats[tCat.id] = {}
      this.changedCats[tCat.id].isDel = true
    }
    tArray.splice(indexes[indexes.length - 1], 1)

    // обрабатываем новый порядок категорий
    this.createNewCatsOrder(tArray)
  },
  createNewCatsOrder(targetCats) {
    // присваивает переданным в массиве категориям новое значение ordering
    targetCats.forEach((cat, i) => {
      const newOrdering = i + 1
      if (newOrdering !== cat.ordering) {
        cat.ordering = newOrdering
        if (this.changedCats[cat.id] === undefined) this.changedCats[cat.id] = {}
        this.changedCats[cat.id].ordering = cat.ordering
      }
    })
  },
})
