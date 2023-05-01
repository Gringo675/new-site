import { createHash } from 'node:crypto'

function hash(string) {
  return createHash('sha256').update(string).digest('hex')
}

const aaa = '12345'
const bbb = hash(aaa)

console.log(`bbb: ${JSON.stringify(bbb, null, 2)}`)
