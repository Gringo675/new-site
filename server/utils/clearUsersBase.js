/**
 * Очищаем базу i_users от мусорных записей
 */

export default async () => {
  const dayAgo = new Date(Date.now() - 864e5).toISOString().slice(0, 19).replace('T', ' ') // without timeZone

  const query = `DELETE FROM i_users WHERE last_refresh = 0 AND created < '${dayAgo}'`

  await dbReq(query)

  return
}
