export default reactive({
  isActive: false,
  indexes: null,
  field: '',
  show(indexes, field) {
    if (this.isActive) return
    this.indexes = indexes
    this.field = field
    this.isActive = true
  },
  hide() {
    this.indexes = null
    this.field = ''
    this.isActive = false
  },
})
