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

export const useCatFields = reactive([
    {
        name: 'name',
        nameRU: 'Наименование',
        isActive: true,
        type: 'text'
    },
    {
        name: 'alias',
        nameRU: 'Алиас',
        isActive: true,
        type: 'text'
    },
    {
        name: 'image',
        nameRU: 'Изображение',
        isActive: true,
        type: 'text'
    },
    {
        name: 'short_description',
        nameRU: 'Краткое описание',
        isActive: true,
        type: 'text',
        hasEditButton: true
    },
    {
        name: 'description',
        nameRU: 'Описание',
        isActive: true,
        type: 'text',
        hasEditButton: true
    },
    {
        name: 'characteristics',
        nameRU: 'Характеристики',
        isActive: true,
        type: 'text',
        hasEditButton: true
    },
    {
        name: 'p0_brand',
        nameRU: 'Производитель',
        isActive: true,
        type: 'select',
        groupID: 0
    },
    {
        name: 'p1_type',
        nameRU: 'Тип',
        isActive: true,
        type: 'select',
        groupID: 1
    },
    {
        name: 'p2_counting_system',
        nameRU: 'Система отсчета',
        isActive: true,
        type: 'select',
        groupID: 2
    },
    {
        name: 'p3_range',
        nameRU: 'Диапазон',
        isActive: true,
        type: 'select',
        groupID: 3
    },
    {
        name: 'p4_size',
        nameRU: 'Размерность',
        isActive: true,
        type: 'select',
        groupID: 4
    },
    {
        name: 'p5_accuracy',
        nameRU: 'Точность',
        isActive: true,
        type: 'select',
        groupID: 5
    },
    {
        name: 'p6_class',
        nameRU: 'Класс',
        isActive: true,
        type: 'select',
        groupID: 6
    },
    {
        name: 'p7_feature',
        nameRU: 'Особенности',
        isActive: true,
        type: 'select',
        groupID: 7
    },
    {
        name: 'p8_pack',
        nameRU: 'Упаковка',
        isActive: true,
        type: 'select',
        groupID: 8
    },
    {
        name: 'meta_title',
        nameRU: 'Meta title',
        isActive: true,
        type: 'text',
        hasEditButton: true
    },
    {
        name: 'meta_description',
        nameRU: 'Meta description',
        isActive: true,
        type: 'text',
        hasEditButton: true
    },
    {
        name: 'meta_keywords',
        nameRU: 'Meta keywords',
        isActive: true,
        type: 'text',
        hasEditButton: true
    },
    {
        name: 'published',
        nameRU: 'Опубликовано',
        isActive: true,
        type: 'checkbox'
    },
])
export const useFilter = reactive({
    showName: true,
    showAlias: true,
    showImage: true,

})

export const useTextEditor = reactive({
    isShow: false,
    parentIndex: null,
    childIndex: null,
    field: ''
})

export const usePropsEditor = reactive({
    isShow: false,
    groupName: '',
    groupNameRU: '',
    groupID: null
})

export const useLoader = reactive({
    isActive: false,
    show: function () {
        this.isActive = true
    },
    hide: function () {
        this.isActive = false
    }
})