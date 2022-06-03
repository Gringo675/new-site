export const useMessage = reactive({
    title: '',
    body: '',
    type: 'info', // or error, success
    isShow: false,
    callback: null,
    isDialog: false,
    show: function(title, body, type = 'info', callback = null) {
        if (this.isShow) return
        this.title = title
        this.body = body
        if (type === 'error' || type === 'success') this.type = type
        if (typeof callback === 'function') {
            this.callback = callback
            this.isDialog = true
        }
        this.isShow = true
    },
    hide: function() {
        this.title = ''
        this.body = ''
        this.type = 'info'
        this.callback = null
        this.isDialog = false
        this.isShow = false
    },
    positiveAction: function() {
        if (typeof this.callback === 'function') this.callback()
        this.hide()
    }
})