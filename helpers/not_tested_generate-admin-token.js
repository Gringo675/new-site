import crypto from 'crypto'
import { Buffer } from 'buffer'

// This script generates an admin JWT token.
// It requires JWT_TOKEN_KEY, JWT_TOKEN_LIFETIME (in ms), and a user ID.
//
// Usage:
// node -r dotenv/config generate-admin-token.js <userId>

const tokenKey = process.env.JWT_TOKEN_KEY
const tokenLifeTime = Number(process.env.JWT_TOKEN_LIFETIME)
const userId = process.argv[2]

if (!tokenKey || !tokenLifeTime || !userId) {
  console.error('Error: Please provide JWT_TOKEN_KEY and JWT_TOKEN_LIFETIME in your .env file and a user ID as an argument.')
  console.error('Usage: node -r dotenv/config generate-admin-token.js <userId>')
  process.exit(1)
}

try {
  const tokenExp = new Date(Date.now() + tokenLifeTime)
  const tokenHead = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'jwt' })).toString('base64')
  const tokenPayload = Buffer.from(
    JSON.stringify({
      id: userId,
      admin: true,
      expires: tokenExp.toISOString(),
    }),
  ).toString('base64')

  const tokenSignature = crypto.createHmac('SHA256', tokenKey).update(`${tokenHead}.${tokenPayload}`).digest('base64')

  const finalToken = `${tokenHead}.${tokenPayload}.${tokenSignature}`

  console.log('Generated Admin Token:\n')
  console.log(finalToken)
  console.log(`\nToken expires: ${tokenExp.toLocaleString()}`)

} catch (error) {
  console.error('Failed to generate token:', error)
  process.exit(1)
}
