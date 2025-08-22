// каждая страница сама формирует массив из объектов вида
//  [
//     {
//         name,
//         alias
//     },
//  ]
// unused, delete?
export default () => {
  return useState('breadCrumbs', () => [])
}
