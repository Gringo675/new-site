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
  timezone: 'Z',
})

export default async (query, params = []) => {
  // pool.execute handles prepared statements automatically in mysql2
  const [rows] = await pool.execute(query, params)
  return rows
}
