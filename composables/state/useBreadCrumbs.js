// каждая страница сама формирует массив из объектов вида
//  [
//     {
//         name,
//         alias
//     },
//  ]
export default () => {
    return useState('breadCrumbs', () => []
    )
}
