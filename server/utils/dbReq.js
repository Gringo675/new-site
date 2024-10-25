import mysql from 'mysql2/promise'

const config = useRuntimeConfig()

const pool = mysql.createPool({
  host: config.dbHost,
  user: config.dbUser,
  database: config.dbName,
  password: config.dbPassword,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

export default async query => {
  const [rows] = await pool.execute(query)

  return rows
}
