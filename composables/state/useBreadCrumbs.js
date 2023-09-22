// каждая страница сама формирует массив из объектов вида
//  [
//     {
//         name,
//         alias
//     },
//  ]
// delete ????
export default () => {
  return useState('breadCrumbs', () => [])
}
