export default defineEventHandler(async event => {
  // Переносит таблицу instr_shippings_photo из старой базы в i_shipping_photos
  try {
    await dbReq(`
      CREATE TABLE IF NOT EXISTS \`i_shipping_photos\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`bill_number\` int NOT NULL,
        \`photo\` varchar(250) NOT NULL,
        PRIMARY KEY (\`id\`),
        KEY \`bill_number\` (\`bill_number\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `)

    const rows = await dbOldReq('SELECT id, bill_number, photo FROM instr_shippings_photo ORDER BY id ASC')

    await dbReq('TRUNCATE i_shipping_photos')

    const batchSize = 1000
    for (let i = 0; i < rows.length; i += batchSize) {
      const batch = rows.slice(i, i + batchSize)
      const placeholders = batch.map(() => '(?, ?, ?)').join(', ')
      const values = batch.flatMap(r => [r.id, r.bill_number, r.photo])
      await dbReq(
        `INSERT INTO i_shipping_photos (id, bill_number, photo) VALUES ${placeholders}`,
        values
      )
    }

    return { status: 'ok', count: rows.length }
  } catch (e) {
    console.error('Error importing shipping photos:', e)
    return { status: 'error', message: e.message }
  }
})
