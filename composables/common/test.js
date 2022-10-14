
// export default () => {
//     return {
//         aaa: useState('aaa', ()=> 222 ),
//         multiply: function () {
//             this.aaa.value = this.aaa.value * 2
//             console.log(`this.aaa.value : ${this.aaa.value }`)
//         }
//     }
// }

// export default () => {
//     const res = {}
//     res.aaa = useState('aaa', ()=> 222 )
//     res.multiply = function () {
//         this.aaa.value = this.aaa.value * 2
//         console.log(`this.aaa.value : ${this.aaa.value }`)
//     }
//     return res
// }

export const useTest = () => useState('aaa', ()=> 222 )
export const multiply = () => {
    const test = useState('aaa', ()=> 222 )
    test.value = test.value * 2
}