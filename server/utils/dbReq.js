import mysql from 'mysql2/promise'

// Кэширование пула в globalThis для предотвращения утечек соединений при HMR
const globalForDb = globalThis

if (!globalForDb._dbPool) {
  const config = useRuntimeConfig()

  globalForDb._dbPool = mysql.createPool({
    host: config.dbHost,
    user: config.dbUser,
    database: config.dbName,
    password: config.dbPassword,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 100, // Защита от OOM при перегрузке
    enableKeepAlive: true, // Поддержание соединения активным
    keepAliveInitialDelay: 0,
    connectTimeout: 10000, // Таймаут подключения 10 сек
    timezone: 'Z',
    namedPlaceholders: true, // Поддержка именованных параметров :param
  })
}

const pool = globalForDb._dbPool

/**
 * Отправляет информацию об ошибке БД в единый лог через /api/log/setError
 */
async function logDbError(error, query = '') {
  try {
    await $fetch('/api/log/setError', {
      method: 'POST',
      body: {
        statusCode: 500,
        statusMessage: `[DB Error]: ${error.message}`,
        query: typeof query === 'string' && query ? query : 'DB Query',
        stack: error.stack || '',
        onServer: true,
      },
    })
  } catch (logError) {
    // Игнорируем ошибки логирования для предотвращения бесконечного цикла, если БД не доступна
  }
}

/**
 * Выполнение обычного SQL-запроса через prepared statement
 */
export default async (query, params = []) => {
  try {
    const [rows] = await pool.execute(query, params)
    return rows
  } catch (error) {
    console.error('[DB Error]:', error.message, '| Query:', query)
    await logDbError(error, query)
    throw createError({
      statusCode: 500,
      statusMessage: 'Database query error',
    })
  }
}

/**
 * Хелпер для безопасного выполнения транзакций на одном соединении
 */
export async function withTransaction(callback) {
  const connection = await pool.getConnection()
  try {
    await connection.beginTransaction()
    const result = await callback(connection)
    await connection.commit()
    return result
  } catch (error) {
    await connection.rollback()
    await logDbError(error, 'Transaction failed')
    throw error
  } finally {
    connection.release()
  }
}
