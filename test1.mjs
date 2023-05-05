import crypto from 'crypto'

const pass = '12345'
const salt = crypto.randomBytes(3).toString('hex') // 6 symbols
console.log(`salt: ${JSON.stringify(salt, null, 2)}`)

const hashCode = crypto.createHmac('SHA256', salt).update(`${pass}`).digest('base64') + `.${salt}`
console.log(`hashCode: ${JSON.stringify(hashCode, null, 2)}`)
console.log(`length: ${JSON.stringify(hashCode.length, null, 2)}`)
