export default reactive({
    isActive: false,
    parentIndex: null,
    childIndex: null,
    field: '',
    fieldRU: '',
    show: function(parentIndex, childIndex, field, fieldRU) {
        if (this.isActive) return
        this.parentIndex = parentIndex
        this.childIndex = childIndex
        this.field = field
        this.fieldRU = fieldRU
        this.isActive = true
    },
    hide: function() {
        this.parentIndex = null
        this.childIndex = null
        this.field = ''
        this.fieldRU = ''
        this.isActive = false
    }
})