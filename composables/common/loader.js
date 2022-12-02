const debounce = 400
let timer

export const useLoader = () => useState('loader', () => {
    return {
        isActive: false
    }
})

export const showLoader = () => {
    if (process.server) return
    const loader = useLoader().value
    timer = setTimeout(() => {
        loader.isActive = true
    }, debounce)
}

export const hideLoader = () => {
    if (process.server) return
    const loader = useLoader().value
    clearTimeout(timer)
    setTimeout(() => { // без задержки при быстрых последовательных включениях иногда не срабатывает реактивность
        loader.isActive = false
    }, 50)
}

// export default {
//     get isActive() {
//         if (!this._isActive) this._isActive = useState('loaderIsActive', () => false)
//         return this._isActive
//     },
//     debounce: 400,
//     timer: null,
//     show: function () {
//         clearTimeout(this.timer)
//         this.timer = setTimeout(() => {
//             this.isActive.value = true
//         }, this.debounce)
//     },
//     hide: function () {
//         clearTimeout(this.timer)
//         setTimeout(() => { // без задержки при быстрых последовательных включениях иногда не срабатывает реактивность
//             this.isActive.value = false
//         }, 50)
//     }
// }
