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
    // валидация
    for (const catID in this.changedCats) {
      const cat = this.changedCats[catID]
      if (cat.isNew && (!cat.name || cat.name === '')) {
        showMessage({
          title: `Название добавляемой категории не может быть пустым!`,
          description: 'Операция прервана.',
          type: 'error',
        })
        return
      }
    }

    const response = await myFetch('/api/admin/setCategories', {
      method: 'post',
      payload: this.changedCats,
    })
    if (response.status === 'ok') {
      // для добавленных категорий возвращается объект {tempId, realId}
      const findAddedCat = (arr, tempId) => {
        for (const cat of arr) {
          if (cat.id == tempId) return cat
          if (cat.children) {
            const addedCat = findAddedCat(cat.children, tempId)
            if (addedCat) return addedCat
          }
        }
      }
      const checkParentId = (arr, tempId, realId) => {
        for (const cat of arr) {
          if (cat.parentId == tempId) cat.parentId = realId
          if (cat.children) checkParentId(cat.children, tempId, realId)
        }
      }
      for (const aCat of response.addedCats) {
        const addedCat = findAddedCat(this.cats, aCat.tempId)
        addedCat.id = Number(aCat.realId)
        if (addedCat.children) checkParentId(addedCat.children, aCat.tempId, aCat.realId)
      }
      this.changedCats = {}
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
    if (options.copy) {
      newCat.alias = '' // не дублируем alias и детей
      delete newCat.children
    }
    newCat.id = Date.now() // temp id
    newCat.parent_id = parentId
    newCat.published = 1
    // при добавлении подподкатегории вставляем пропсы родителя
    if (indexes.length === 3 && !options.subcat && !options.copy) {
      const parentCat = this.getCat(indexes.slice(0, -1))
      for (const key in parentCat) {
        if (/^p\d_/.test(key)) newCat[key] = parentCat[key]
      }
    }
    if (options.subcat) {
      // наследуем пропсы от родительской категории
      for (const key in tCat) {
        if (/^p\d_/.test(key)) newCat[key] = tCat[key]
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
