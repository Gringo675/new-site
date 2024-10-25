import mysql from 'mysql2/promise'
const config = useRuntimeConfig()

export default async query => {
  const connection = await mysql.createConnection({
    host: config.dbHost,
    user: config.dbOldUser,
    database: config.dbOldName,
    password: config.dbOldPassword,
  })

  const [rows] = await connection.execute(query)

  return rows
}
