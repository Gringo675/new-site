export default {
    get isActive() {
        if (!this._isActive) this._isActive = useState('textEditorIsActive', () => false)
        return this._isActive
    },
    parentIndex: null,
    childIndex: null,
    field: '',
    show: function(parentIndex, childIndex, field) {
        if (this.isActive.value) return
        this.parentIndex = parentIndex
        this.childIndex = childIndex
        this.field = field
        this.isActive.value = true
    },
    hide: function() {
        this.parentIndex = null
        this.childIndex = null
        this.field = ''
        this.isActive.value = false
    }
}