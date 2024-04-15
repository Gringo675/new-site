const regex = /translate\((-?\d*\.?\d+px), (-?\d*\.?\d+px)\)/
const str = 'translate(-227.797px, -227.797px)  scale(2)'
const match = str.match(regex)
console.log(`match: ${JSON.stringify(match, null, 2)}`)

if (match) {
  const X = match[1]
  const Y = match[2]
  console.log('X:', X, 'Y:', Y)
} else {
  console.log('Pattern not found')
}

let arr = [2025, 12, 31]
let [, month, day] = arr

console.log(month) // выведет 12
console.log(day) // выведет 31
