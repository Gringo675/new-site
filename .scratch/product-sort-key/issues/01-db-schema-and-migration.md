Status: closed
Type: task
Blocked by: none

# 01 - DB Schema Update & Initial Sort Key Migration (Local DB)

## Описание
Добавить в таблицу локальной базы данных `i_products` колонку `sort_key` и составной индекс `(category_id, sort_key)`. Создать разовый миграционный скрипт для расчета и заполнения `sort_key` для всей существующей локальной базы товаров.

> Примечание: Применение изменений к боевой облачной БД вынесено в отдельную задачу `05-production-db-migration.md` после завершения всех тестов.

## Требования

1. **Изменение структуры локальной БД:**
   - Добавить поле:
     ```sql
     ALTER TABLE i_products ADD COLUMN sort_key VARCHAR(64) NOT NULL DEFAULT '';
     ```
   - Добавить составной индекс для мгновенной выборки категории с сортировкой:
     ```sql
     ALTER TABLE i_products ADD INDEX idx_cat_sort (category_id, sort_key);
     ```

2. **Миграционный скрипт начального заполнения:**
   - Расположение: `server/api/admin/system/recalculateSortKeys.js` и `.scratch/product-sort-key/test-and-migrate.mjs`.
   - Загружает все свойства из `i_properties` в `Map<id, ordering>`.
   - Выбирает все товары из `i_products`.
   - Вычисляет 51-символьный `sort_key` с учетом `usePrpsGroupsMap(category_id)` (9 блоков свойств по 4 знака + ID товара).
   - Массово обновляет `i_products` пакетно (`CASE id ...`).

## Критерии приемки
- [x] Колонка `sort_key VARCHAR(64)` добавлена в локальную таблицу `i_products`.
- [x] Индекс `idx_cat_sort (category_id, sort_key)` успешно создан.
- [x] Все существующие товары в локальной БД заполнены корректными значениями `sort_key`.
- [x] Отсутствуют пустые значения `sort_key` у опубликованных товаров.
