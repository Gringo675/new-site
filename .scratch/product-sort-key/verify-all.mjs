import mysql from 'mysql2/promise'
import { usePrpsGroupsMap } from '../../shared/utils/usePrpsGroupsMap.js'
import { buildProductSortKey, recalculateProductsSortKey } from '../../server/utils/productSortKey.js'

globalThis.usePrpsGroupsMap = usePrpsGroupsMap

async function verify() {
  console.log('=== Running verification suite ===')

  const conn = await mysql.createConnection({
    host: '127.0.0.1',
    user: 'chelin_v2',
    password: 'Dbrbgt675v2',
    database: 'chelin_v2',
  })

  // 1. Verify schema and index
  console.log('\n--- 1. Checking schema and indexes ---')
  const [cols] = await conn.query("SHOW COLUMNS FROM i_products LIKE 'sort_key'")
  console.log('sort_key column:', cols[0].Field, cols[0].Type)
  if (cols[0].Type !== 'varchar(64)') {
    throw new Error('sort_key column type mismatch!')
  }

  const [indexes] = await conn.query("SHOW INDEX FROM i_products WHERE Key_name = 'idx_cat_sort'")
  console.log('idx_cat_sort index columns:', indexes.map(i => `${i.Column_name} (#${i.Seq_in_index})`))
  if (indexes.length !== 2) {
    throw new Error('idx_cat_sort index missing or incomplete!')
  }

  // 2. Verify EXPLAIN on category query
  console.log('\n--- 2. Checking EXPLAIN query execution plan ---')
  const [explainCategory] = await conn.query(
    'EXPLAIN SELECT id, name, sort_key FROM i_products WHERE category_id = 11 AND published = 1 ORDER BY sort_key ASC'
  )
  console.log('Category EXPLAIN:\n', {
    type: explainCategory[0].type,
    key: explainCategory[0].key,
    rows: explainCategory[0].rows,
    extra: explainCategory[0].Extra,
  })
  if (explainCategory[0].key !== 'idx_cat_sort') {
    throw new Error('Category query is not using idx_cat_sort!')
  }

  // 3. Verify EXPLAIN on Excel query
  console.log('\n--- 3. Checking EXPLAIN on Excel export query ---')
  const [explainExcel] = await conn.query(
    `EXPLAIN SELECT p.id, p.name, p.price
     FROM i_products p
     JOIN i_categories c ON c.id = p.category_id
     WHERE p.published = 1
     ORDER BY c.ordering ASC, p.sort_key ASC`
  )
  console.log('Excel EXPLAIN:', explainExcel.map(e => ({ table: e.table, key: e.key, extra: e.Extra })))

  // 4. Verify all products have valid sort_key
  console.log('\n--- 4. Checking sort_key integrity for all products ---')
  const [emptyKeys] = await conn.query(
    "SELECT COUNT(*) as count FROM i_products WHERE sort_key IS NULL OR CHAR_LENGTH(sort_key) != 51"
  )
  console.log('Products with invalid or non-51-char sort_key:', emptyKeys[0].count)
  if (emptyKeys[0].count > 0) {
    throw new Error(`Found ${emptyKeys[0].count} products with invalid sort_key!`)
  }

  // 5. Test recalculateProductsSortKey utility
  console.log('\n--- 5. Testing recalculateProductsSortKey utility ---')
  // Polyfill global dbReq for testing
  globalThis.dbReq = async (sql, params = []) => {
    const [rows] = await conn.query(sql, params)
    return rows
  }

  // Test single product recalculation
  const testId = 110001
  const [before] = await conn.query('SELECT sort_key FROM i_products WHERE id = ?', [testId])
  console.log(`Product ${testId} before:`, before[0].sort_key)

  const resSingle = await recalculateProductsSortKey([testId])
  console.log('Single product recalculate result:', resSingle)

  const [after] = await conn.query('SELECT sort_key FROM i_products WHERE id = ?', [testId])
  console.log(`Product ${testId} after: `, after[0].sort_key)
  if (before[0].sort_key !== after[0].sort_key) {
    throw new Error('Key changed unexpectedly!')
  }

  // Test category recalculation
  const resCat = await recalculateProductsSortKey({ categoryId: 11 })
  console.log('Category recalculation result:', resCat)
  if (resCat.updatedCount === 0) {
    throw new Error('Category recalculation updated 0 rows!')
  }

  console.log('\n=== ALL VERIFICATIONS PASSED SUCCESSFULLY! ===')
  await conn.end()
}

verify().catch(err => {
  console.error('\nVerification failed:', err)
  process.exit(1)
})
