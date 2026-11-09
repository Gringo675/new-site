import mysql from 'mysql2/promise'
import { usePrpsGroupsMap } from '../../shared/utils/usePrpsGroupsMap.js'
import { buildProductSortKey } from '../../server/utils/productSortKey.js'

globalThis.usePrpsGroupsMap = usePrpsGroupsMap

async function run() {
  console.log('--- 1. Testing buildProductSortKey unit logic ---')

  // Sample props ordering map
  const mockPropsMap = new Map([
    [10, 5],   // p1_type order 5
    [20, 10],  // p2_counting_system order 10
    [30, 15],  // p3_range order 15
    [40, 20],  // p4_size order 20
    [50, 25],  // p5_accuracy order 25
    [60, 30],  // p6_class order 30
    [70, 35],  // p7_feature order 35
    [80, 40],  // p0_brand order 40
    [90, 45],  // p8_pack (disabled)
  ])

  // Test 1: Standard category
  const prodA = {
    id: 150001,
    category_id: 15,
    p1_type: 10,
    p2_counting_system: 20,
    p3_range: 30,
    p4_size: 40,
    p5_accuracy: 50,
    p6_class: 60,
    p7_feature: 70,
    p0_brand: 80,
    p8_pack: 90,
  }

  const keyA = buildProductSortKey(prodA, mockPropsMap)
  console.log('Product A key:', keyA)
  console.log('Length:', keyA.length)
  if (keyA.length !== 51) {
    throw new Error(`Expected length 51, got ${keyA.length}`)
  }

  // Test 2: Category 11 (штангенциркули) where p5_accuracy (ordering 50) goes before p4_size (ordering 51)
  const prodCaliper = {
    id: 110005,
    category_id: 11,
    p1_type: 10, // order 5
    p2_counting_system: 0, // missing -> 9999
    p3_range: 30, // order 15
    p4_size: 40, // order 20 (group ordering 51)
    p5_accuracy: 50, // order 25 (group ordering 50 -> comes BEFORE p4_size!)
    p6_class: 0,
    p7_feature: 0,
    p0_brand: 80,
    p8_pack: 90, // disabled -> 9999
  }

  const keyCaliper = buildProductSortKey(prodCaliper, mockPropsMap)
  console.log('Caliper key:', keyCaliper)
  console.log('Length:', keyCaliper.length)
  if (keyCaliper.length !== 51) {
    throw new Error(`Expected length 51, got ${keyCaliper.length}`)
  }

  // Check blocks:
  // p1_type (ord 5 -> 0005)
  // p2_counting_system (0 -> 9999)
  // p3_range (ord 15 -> 0015)
  // 4th group is p5_accuracy (ord 25 -> 0025)
  // 5th group is p4_size (ord 20 -> 0020)
  const caliperBlocks = keyCaliper.split('_')
  console.log('Caliper blocks:', caliperBlocks)
  if (caliperBlocks[3] !== '0025' || caliperBlocks[4] !== '0020') {
    throw new Error(`Caliper group order incorrect! Expected block[3]='0025' (accuracy) and block[4]='0020' (size), got ${caliperBlocks[3]} and ${caliperBlocks[4]}`)
  }
  console.log('Unit tests PASSED successfully!\n')

  console.log('--- 2. Performing initial migration on local DB ---')
  const conn = await mysql.createConnection({
    host: '127.0.0.1',
    user: 'chelin_v2',
    password: 'Dbrbgt675v2',
    database: 'chelin_v2',
  })

  // Load real properties map
  const [propRows] = await conn.query('SELECT id, ordering FROM i_properties')
  const realPropsMap = new Map()
  for (const row of propRows) {
    realPropsMap.set(Number(row.id), Number(row.ordering))
  }
  console.log(`Loaded ${realPropsMap.size} properties from i_properties.`)

  // Load all products
  const [products] = await conn.query(
    'SELECT id, category_id, p0_brand, p1_type, p2_counting_system, p3_range, p4_size, p5_accuracy, p6_class, p7_feature, p8_pack FROM i_products'
  )
  console.log(`Found ${products.length} products in i_products. Calculating sort_keys...`)

  const updates = []
  for (const prod of products) {
    const sortKey = buildProductSortKey(prod, realPropsMap)
    if (sortKey.length !== 51) {
      throw new Error(`Invalid sort_key length ${sortKey.length} for product ${prod.id}`)
    }
    updates.push({ id: prod.id, sort_key: sortKey })
  }

  // Batch update
  const batchSize = 500
  let updatedCount = 0
  for (let i = 0; i < updates.length; i += batchSize) {
    const chunk = updates.slice(i, i + batchSize)
    const cases = chunk.map(() => 'WHEN id = ? THEN ?').join(' ')
    const params = chunk.flatMap(u => [u.id, u.sort_key])
    const ids = chunk.map(u => u.id)
    const idPlaceholders = ids.map(() => '?').join(', ')

    await conn.query(
      `UPDATE i_products SET sort_key = CASE ${cases} END WHERE id IN (${idPlaceholders})`,
      [...params, ...ids]
    )
    updatedCount += chunk.length
  }

  console.log(`Successfully migrated ${updatedCount} products in local DB!`)

  // Verification in DB
  const [emptyCheck] = await conn.query("SELECT COUNT(*) as cnt FROM i_products WHERE sort_key = '' OR sort_key IS NULL")
  console.log('Products with empty sort_key:', emptyCheck[0].cnt)

  const [sampleRows] = await conn.query('SELECT id, category_id, sort_key FROM i_products WHERE category_id = 11 ORDER BY sort_key ASC LIMIT 5')
  console.log('Sample category 11 sorted products:\n', sampleRows)

  await conn.end()
}

run().catch(err => {
  console.error('Migration failed:', err)
  process.exit(1)
})
