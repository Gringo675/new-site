import 'dotenv/config'
import crypto from 'crypto'
import { Buffer } from 'buffer'

async function generateAdminToken(userId = '1') {
  const tokenKey = process.env.JWT_TOKEN_KEY
  const tokenLifeTime = Number(process.env.JWT_TOKEN_LIFETIME)

  if (!tokenKey || !tokenLifeTime) {
    throw new Error('JWT_TOKEN_KEY or JWT_TOKEN_LIFETIME not found in .env')
  }

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
  return `${tokenHead}.${tokenPayload}.${tokenSignature}`
}

;(async function () {
  try {
    const token = await generateAdminToken()
    const response = await fetch('http://localhost:3000/api/admin/test', {
      headers: {
        Cookie: `token=${token}`,
      },
    })
    const res = await response.text()
    console.log(res)
  } catch (error) {
    console.error('Error:', error)
  }
})()
