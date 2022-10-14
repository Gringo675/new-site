export default {
    get isActive() {
        if (!this._isActive) this._isActive = useState('propsEditorIsActive', () => false)
        return this._isActive
    },
    groupName: '',
    groupNameRU: '',
    groupID: null,
    show: function(groupName, groupNameRU, groupID) {
        if (this.isActive.value) return
        this.groupName = groupName
        this.groupNameRU = groupNameRU
        this.groupID = groupID
        this.isActive.value = true
    },
    hide: function() {
        this.groupName = ''
        this.groupNameRU = ''
        this.groupID = null
        this.isActive.value = false
    }
}