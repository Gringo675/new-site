
export default reactive({
    items: [],
    async getItems() {
        this.items = await myFetch('/api/admin/getProperties', {auth: true})
    },
    async handleChanges(groupName, newItems) {
        const oldItems = this.items[groupName]
        newItems.forEach((item, i) => { // записываем правильное значение ordering
            item.ordering = i + 1
        })
        const changedItems = []
        // new
        newItems.filter(item => item.id === undefined).forEach(item => {
            item.isNew = true
            changedItems.push(item)
        })
        // changed or deleted
        oldItems.forEach(oldItem => {
            const newItem = newItems.find(newItem => newItem.id === oldItem.id)
            if (newItem === undefined) {
                oldItem.isDel = true
                changedItems.push(oldItem)
            } else {
                if (oldItem.name !== newItem.name || oldItem.ordering !== newItem.ordering) {
                    newItem.isChanged = true
                    changedItems.push(newItem)
                }
            }
        })

        if (changedItems.length) {
            const success = await myFetch('/api/admin/setProperties', {
                auth: true,
                method: 'post',
                payload: changedItems
            })
            if (success) await this.getItems() // обновляем с новыми данными
            else return false
        }
        return true
    }
})

