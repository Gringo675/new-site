Status: open
Type: task
Blocked by: none

# 01 - DB Schema Update & Initial Sort Key Migration

## Описание
Добавить в таблицу базы данных `i_products` колонку `sort_key` и составной индекс `(category_id, sort_key)`. Создать разовый миграционный скрипт для расчета и заполнения `sort_key` для всей существующей базы товаров.

## Требования

1. **Изменение структуры БД:**
   - Добавить поле:
     ```sql
     ALTER TABLE i_products ADD COLUMN sort_key VARCHAR(64) NOT NULL DEFAULT '';
     ```
   - Добавить составной индекс для мгновенной выборки категории с сортировкой:
     ```sql
     ALTER TABLE i_products ADD INDEX idx_cat_sort (category_id, sort_key);
     ```

2. **Миграционный скрипт начального заполнения:**
   - Расположение: `server/api/admin/migrations/migrateProductSortKeys.js` (или отдельный CLI-скрипт).
   - Загружает все свойства из `i_properties` в `Map<id, ordering>`.
   - Выбирает все товары из `i_products` (включая неактивные/черновики).
   - Вычисляет `sort_key` по стандарту (9 блоков параметров по 4 символа с ведущими нулями + ID товара).
   - Массово обновляет `i_products` пакетами (batch updates).

## Критерии приемки
- [ ] Колонка `sort_key VARCHAR(64)` добавлена в таблицу `i_products`.
- [ ] Индекс `idx_cat_sort (category_id, sort_key)` успешно создан.
- [ ] Все существующие товары в БД заполнены корректными значениями `sort_key`.
- [ ] Отсутствуют пустые значения `sort_key` у опубликованных товаров.
