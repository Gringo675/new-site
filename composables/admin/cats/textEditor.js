export default reactive({
    isActive: false,
    indexes: null,
    field: '',
    fieldRU: '',
    show(indexes, field, fieldRU) {
        if (this.isActive) return
        this.indexes = indexes
        this.field = field
        this.fieldRU = fieldRU
        this.isActive = true
    },
    hide() {
        this.indexes = null
        this.field = ''
        this.fieldRU = ''
        this.isActive = false
    }
})