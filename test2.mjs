const str = 'first secont third'

const first = str.match(/\S+/)[0]

console.log(`first: ${JSON.stringify(first, null, 2)}`)
