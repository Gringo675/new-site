export default reactive({
    isActive: false,
    groupName: '',
    groupNameRU: '',
    groupID: null,
    show(groupName, groupNameRU, groupID) {
        if (this.isActive) return
        this.groupName = groupName
        this.groupNameRU = groupNameRU
        this.groupID = groupID
        this.isActive = true
    },
    hide() {
        this.groupName = ''
        this.groupNameRU = ''
        this.groupID = null
        this.isActive = false
    }
})