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
async function logDbError(error, query = '', params = []) {
  try {
    const rawQuery = typeof query === 'string' && query ? query : 'DB Query'
    const queryPreview = rawQuery.length > 1000 ? `${rawQuery.slice(0, 1000)}...` : rawQuery

    // Безопасная обработка параметров (поддержка массивов и объектов, защита от переполнения 64КБ)
    let safeParams = []
    if (Array.isArray(params)) {
      safeParams = params.map(p => (typeof p === 'string' && p.length > 5000 ? `${p.slice(0, 5000)}...[truncated]` : p))
    } else if (params && typeof params === 'object') {
      safeParams = { ...params }
      for (const k in safeParams) {
        if (typeof safeParams[k] === 'string' && safeParams[k].length > 5000) {
          safeParams[k] = `${safeParams[k].slice(0, 5000)}...[truncated]`
        }
      }
    }

    await $fetch('/api/log/setError', {
      method: 'POST',
      body: {
        statusCode: 500,
        statusMessage: `[DB Error]: ${error?.message || 'Unknown error'} | Query: ${queryPreview}`,
        query: rawQuery,
        params: safeParams,
        code: error?.code || null,
        url: '[server:dbReq]',
        stack: error?.stack || 'No stack',
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
export default async (query, params = [], { skipErrorLog = false } = {}) => {
  try {
    const [rows] = await pool.execute(query, params)
    return rows
  } catch (error) {
    if (!skipErrorLog) {
      console.error('[DB Error]:', error.message, '| Query:', query)
      await logDbError(error, query, params)
    }
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
