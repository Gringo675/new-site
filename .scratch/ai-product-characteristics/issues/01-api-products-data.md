---
Status: ready-for-agent
---

# Issue 01: API эндпойнт выборки данных товаров категории (`productsData`)

## Проблема
Для генерации характеристик товаров через воркфлоу Mastra требуются данные по товарам категории: их свойства (`i_properties`), действующие характеристики (`characteristics`), а также тексты нормативных документов (`i_docs_stnd`, `i_docs_rstr`), привязанных к конкретным товарам. Существующий `server/api/getData/product/[p_alias].js` не загружает тексты документов и работает поштучно, а `categoryData/[c_alias].js` агрегирует документы на уровне всей категории.

## Требования к реализации
1. Создать эндпойнт `server/api/ai/productsData/[c_alias].js`.
2. Логика выборки:
   - Найти категорию по `c_alias` из `i_categories`.
   - Если подкатегория (`parent_id !== 0`), собрать фильтры активных свойств (`catActiveProps`).
   - Получить товары (`i_products`) с фильтрацией по категории и подкатегории.
   - Расшифровать свойства товаров (`p0_brand`, `p1_type`, `p3_range`, `p4_size`, `p5_accuracy` и др.) из `i_properties`.
   - Собрать уникальные `standart_ids` и `reestr_ids` для товаров выборки.
   - Загрузить тексты документов с внешнего хранилища `https://chelinstrument.ru/static/doc/parsed/md/${fileName.replace('.pdf', '.md')}`.
3. Формат ответа:
   ```json
   {
     "category": {
       "id": 11,
       "name": "Уровни",
       "alias": "urovni",
       "characteristics": "..."
     },
     "docs": {
       "stnd": {
         "12": { "number": "ГОСТ 9392-89", "name": "...", "year": 2000, "url": "...", "text": "..." }
       },
       "rstr": {
         "45": { "number": "93612-24", "name": "...", "year": 2024, "url_ot": "...", "text_ot": "...", "text_mp": "..." }
       }
     },
     "products": [
       {
         "id": 140002,
         "name": "Уровень брусковый L150мм 0,02мм/м ЧИЗ",
         "alias": "uroven-bruskovyj-l150mm-002mmm-chiz",
         "brand": "ЧИЗ",
         "characteristics": "...",
         "props": {
           "Размер": "150 мм",
           "Точность отсчета": "0,02 мм/м"
         },
         "stndIds": [12],
         "rstrIds": [45]
       }
     ]
   }
   ```
