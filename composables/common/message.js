export default {
    get isActive() {
        if (!this._isActive) this._isActive = useState('messageIsActive', () => false)
        return this._isActive
    },
    title: '',
    body: '',
    type: 'info', // or error, success
    callback: null,
    isDialog: false,
    show: function(title, body, type = 'info', callback = null) {
        if (this.isActive.value) return
        this.title = title
        this.body = body
        if (type === 'error' || type === 'success') this.type = type
        if (typeof callback === 'function') {
            this.callback = callback
            this.isDialog = true
        }
        this.isActive.value = true
    },
    hide: function() {
        this.title = ''
        this.body = ''
        this.type = 'info'
        this.callback = null
        this.isDialog = false
        this.isActive.value = false
    },
    positiveAction: function() {
        if (typeof this.callback === 'function') this.callback()
        this.hide()
    }
}