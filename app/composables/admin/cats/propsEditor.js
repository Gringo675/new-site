export default reactive({
  isActive: false,
  indexes: null,
  groupName: '',
  show(indexes, groupName) {
    if (this.isActive) return
    this.indexes = indexes
    this.groupName = groupName
    this.isActive = true
  },
  hide() {
    this.indexes = null
    this.groupName = ''
    this.isActive = false
  },
})
