Status: open
Type: task
Blocked by: 01-db-schema-and-migration.md

# 02 - Core Sort Key Generator Utility (`server/utils/productSortKey.js`)

## Описание
Создать централизованную серверную утилиту для расчета и обновления `sort_key` товаров. Модуль должен использоваться как миграционными скриптами, так и API-обработчиками сохранения товаров.

## Требования

1. **Формирование ключа (`buildProductSortKey`):**
   - Принимает объект товара с полями `p0_brand` ... `p8_pack` и `id`.
   - Принимает словарь весов `propsOrderingMap` (где ключ — `prop_id`, значение — `ordering` из таблицы `i_properties`).
   - Иерархия параметров строго по `usePrpsGroupsMap`:
     1. `p1_type` (order = 10)
     2. `p2_counting_system` (order = 20)
     3. `p3_range` (order = 30)
     4. `p4_size` (order = 40)
     5. `p5_accuracy` (order = 50)
     6. `p6_class` (order = 60)
     7. `p7_feature` (order = 70)
     8. `p0_brand` (order = 80)
     9. `p8_pack` (order = 90)
   - Если свойство отсутствует (0, null, undefined) — значение блока `'9999'`.
   - Если свойство задано — значение блока `String(order).padStart(4, '0')`.
   - Tie-breaker — `String(product.id).padStart(6, '0')`.
   - Результат склеивается через символ `_`.

2. **Функция пакетного обновления (`recalculateProductsSortKey`):**
   - Принимает список `productIds` или `categoryId`.
   - Автоматически подгружает актуальные `i_properties.ordering`.
   - Рассчитывает ключи и выполняет пакетный `UPDATE` через `CASE id WHEN ... THEN ... END`.

## Критерии приемки
- [ ] Модуль `server/utils/productSortKey.js` создан и экспортирует функции `buildProductSortKey` и `recalculateProductsSortKey`.
- [ ] Ключ формируется детерминированно и имеет фиксированную длину и структуру.
- [ ] Корректно обрабатываются пропущенные и нулевые характеристики (`9999`).
- [ ] Написаны модульные тесты для проверки консистентности сортировки.
