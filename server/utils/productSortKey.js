/**
 * Загружает из базы актуальный справочник весов характеристик i_properties.
 * @returns {Promise<Map<number, number>>} Map<prop_id, ordering>
 */
export async function getPropsOrderingMap() {
  const query = 'SELECT id, ordering FROM i_properties'
  const rows = await dbReq(query)
  const map = new Map()
  for (const row of rows) {
    map.set(Number(row.id), Number(row.ordering))
  }
  return map
}

/**
 * Формирует детерминированный 51-символьный лексикографический ключ сортировки товара.
 * Формат: [B1]_[B2]_[B3]_[B4]_[B5]_[B6]_[B7]_[B8]_[B9]_[ID]
 *
 * @param {object} product - Объект товара, содержащий id, category_id, p0_brand..p8_pack
 * @param {Map<number, number>|object} propsOrderingMap - Справочник весов свойств
 * @returns {string} 51-значная строка sort_key
 */
export function buildProductSortKey(product, propsOrderingMap) {
  if (!product) return ''

  const catId = Number(product.category_id) || 0
  const groupsMap = usePrpsGroupsMap(catId)

  // Сортируем группы:
  // 1. Активные (!disabled) сортируются по (sortOrdering ?? ordering) ASC
  // 2. Отключенные (disabled: true) идут в конец
  const sortedGroups = Array.from(groupsMap.entries()).sort((a, b) => {
    const aDisabled = Boolean(a[1].disabled)
    const bDisabled = Boolean(b[1].disabled)
    if (aDisabled !== bDisabled) {
      return aDisabled ? 1 : -1
    }
    const aOrder = a[1].sortOrdering ?? a[1].ordering ?? 9999
    const bOrder = b[1].sortOrdering ?? b[1].ordering ?? 9999
    return aOrder - bOrder
  })

  const blocks = []

  for (const [groupKey, groupConfig] of sortedGroups) {
    if (groupConfig.disabled) {
      blocks.push('9999')
      continue
    }

    const propId = Number(product[groupKey])
    if (propId > 0) {
      const ord = propsOrderingMap instanceof Map ? propsOrderingMap.get(propId) : propsOrderingMap?.[propId]

      if (typeof ord === 'number' && ord >= 0 && ord < 9999) {
        blocks.push(String(ord).padStart(4, '0'))
      } else {
        blocks.push('9999')
      }
    } else {
      blocks.push(groupConfig.emptyFirst ? '0000' : '9999')
    }
  }

  // Tie-breaker: 6-значный ID товара
  const idStr = String(product.id || 0).padStart(6, '0')
  blocks.push(idStr)
  return blocks.join('_')
}

/**
 * Пересчитывает и пакетно обновляет sort_key в i_products.
 *
 * @param {number[]|object} [target]
 *  - number[]: массив productIds для точечного пересчета
 *  - { categoryId: number }: пересчитать категорию
 *  - { propIds: number[] }: пересчитать товары, использующие указанные свойства
 *  - undefined / 'all': пересчитать абсолютно все товары
 * @returns {Promise<{ updatedCount: number }>}
 */
export async function recalculateProductsSortKey(target) {
  let targetIds = []

  if (Array.isArray(target)) {
    targetIds = target.map(Number).filter(Boolean)
  } else if (target && typeof target === 'object') {
    const rawCatId = target.categoryId
    const catId = typeof rawCatId === 'object' && rawCatId !== null ? Number(rawCatId.value ?? rawCatId.id) : Number(rawCatId)

    if (catId && !isNaN(catId)) {
      const rows = await dbReq('SELECT id FROM i_products WHERE category_id = ?', [catId])
      targetIds = rows.map(r => r.id)
    } else if (Array.isArray(target.propIds) && target.propIds.length) {
      const pIds = target.propIds.map(Number).filter(Boolean)
      if (pIds.length) {
        const placeholders = pIds.map(() => '?').join(', ')
        const propKeys = ['p0_brand', 'p1_type', 'p2_counting_system', 'p3_range', 'p4_size', 'p5_accuracy', 'p6_class', 'p7_feature', 'p8_pack']
        const whereClause = propKeys.map(k => `${k} IN (${placeholders})`).join(' OR ')
        const params = propKeys.flatMap(() => pIds)
        const rows = await dbReq(`SELECT id FROM i_products WHERE ${whereClause}`, params)
        targetIds = rows.map(r => r.id)
      }
    }
  } else {
    // Recalculate all products
    const rows = await dbReq('SELECT id FROM i_products')
    targetIds = rows.map(r => r.id)
  }

  // Убираем дубликаты
  targetIds = Array.from(new Set(targetIds))

  if (!targetIds.length) {
    return { updatedCount: 0 }
  }

  const propsOrderingMap = await getPropsOrderingMap()

  // Загружаем полные строки товаров пакетами (по 500 штук)
  const batchSize = 500
  let updatedCount = 0

  for (let i = 0; i < targetIds.length; i += batchSize) {
    const chunkIds = targetIds.slice(i, i + batchSize)
    const placeholders = chunkIds.map(() => '?').join(', ')

    const prods = await dbReq(
      `SELECT id, category_id, p0_brand, p1_type, p2_counting_system, p3_range, p4_size, p5_accuracy, p6_class, p7_feature, p8_pack
       FROM i_products
       WHERE id IN (${placeholders})`,
      chunkIds,
    )

    if (!prods.length) continue

    const updates = []
    for (const prod of prods) {
      const key = buildProductSortKey(prod, propsOrderingMap)
      updates.push({ id: prod.id, sort_key: key })
    }

    // Собираем CASE WHEN для атомарного пакетного UPDATE
    const cases = updates.map(() => 'WHEN id = ? THEN ?').join(' ')
    const caseParams = updates.flatMap(u => [u.id, u.sort_key])
    const updateIds = updates.map(u => u.id)
    const updateIdPlaceholders = updateIds.map(() => '?').join(', ')

    await dbReq(
      `UPDATE i_products
       SET sort_key = CASE
         ${cases}
       END
       WHERE id IN (${updateIdPlaceholders})`,
      [...caseParams, ...updateIds],
    )

    updatedCount += updates.length
  }

  return { updatedCount }
}
