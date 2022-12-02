
export default reactive({
    items: [],
    async getItems() {
        this.items = await myFetch('/api/admin/getCategories', {auth: true})
    },
    changedCats: {},
    handleChanges(catID, key, newContent) {
        if (this.changedCats[catID] === undefined) this.changedCats[catID] = {}
        this.changedCats[catID][key] = newContent
    },
    async saveChanges() {
        if (!Object.keys(this.changedCats).length) return

        await myFetch('/api/admin/setCategories',
            {
                auth: true,
                method: 'post',
                payload: this.changedCats
            })

        this.changedCats = {}
    },
    addCat(parentIndex, childIndex, isCopy) {
        /**
         * У функции три варианта добавления категории:
         * Копирование - определяется по флагу isCopy. Таргет-категория просто копируется рядом с новым ID.
         * Добавление - новая пустая категория с сгенерированным ID вставляется на одном уровне с таргет-категорией (рядом).
         * Добавление подкатегории - возможна только для "главных" категорий. Определяется по childIndex === undefined (не
         * передается в функцию). Добавляет пустую подкатегорию для таргет-категории (в конец).
         */

        const isAddSubCat = childIndex === undefined
        const targetCat = (childIndex >= 0 && childIndex !== null ? this.items[parentIndex].children[childIndex] : this.items[parentIndex])
        if (isAddSubCat && targetCat.children === undefined) targetCat.children = []
        const targetArray = (childIndex !== null ? this.items[parentIndex].children : this.items) // куда будем вставлять

        const newID = (targetArray.length ? Math.max.apply(null, targetArray.map(cat => cat.id)) + 1 : targetCat.id * 100 + 1)
        const newCat = (isCopy ? JSON.parse(JSON.stringify(targetCat)) : {})
        delete newCat.children // при копировании дети не копируются
        newCat.id = newID
        if (isAddSubCat) { // вставляем в конец
            targetArray.push(newCat)
        } else {  // вставляем рядом
            const targetIndex = (childIndex >= 0 && childIndex !== null ? childIndex : parentIndex) + 1
            targetArray.splice(targetIndex, 0, newCat)
        }
        // сохраняем изменения в спец. объекте
        const wasDeleted = this.changedCats[newCat.id]?.isDel // проверяем, не была ли категория с таким же ID предварительна удалена
        this.changedCats[newCat.id] = JSON.parse(JSON.stringify(newCat))
        if (wasDeleted) this.changedCats[newCat.id].isDel = true // возвращаем флаг, чтобы при обработке на сервере предварительно удалить старую
        this.changedCats[newCat.id].isNew = true
        delete this.changedCats[newCat.id].id // убираем дублирование ID

        // обрабатываем новый порядок категорий
        this.createNewCatsOrder(targetArray)
    },
    deleteCat(parentIndex, childIndex) {
        const targetCat = (childIndex !== null ? this.items[parentIndex].children[childIndex] : this.items[parentIndex])
        const targetArray = (childIndex !== null ? this.items[parentIndex].children : this.items) // откуда будем удалять
        const targetIndex = (childIndex !== null ? childIndex : parentIndex)
        const targetID = targetCat.id

        if (this.changedCats[targetID]?.isNew) { // если до этого добавили эту категорию
            delete this.changedCats[targetID]  // просто удаляем
        } else {
            this.changedCats[targetID] = {}
            this.changedCats[targetID].isDel = true
        }
        targetArray.splice(targetIndex, 1)

        // обрабатываем новый порядок категорий
        this.createNewCatsOrder(targetArray)
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
    draggableCatIndex: {
        group: null,
        item: null
    }
})