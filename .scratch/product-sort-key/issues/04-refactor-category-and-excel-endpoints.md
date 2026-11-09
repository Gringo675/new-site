Status: closed
Type: task
Blocked by: 03-update-triggers-and-admin-handlers.md

# 04 - Refactor Existing Sorting Points & Excel Export

## Описание
Заменить устаревшую ручную сортировку по свойствам в оперативной памяти (`products.sort(...)`) на прямую сортировку по индексу `ORDER BY sort_key ASC` во всех точках кодовой базы, а также упорядочить выгрузку товаров в Excel.

## Места рефакторинга в коде

1. **Публичный каталог (`server/api/getData/category/[c_alias].js`):**
   - В SQL-запрос `SELECT ... FROM i_products WHERE category_id = ? ...` добавлен `ORDER BY sort_key ASC`.
   - Сохранены строки формирования массива `filter` для UI-фильтров каталога на фронтенде.
   - Удален ручной цикл сортировки товаров в оперативной памяти (`products.sort(...)`).

2. **Админка CMS Товары — API (`server/api/admin/cms/products/getProds.js`):**
   - Добавлен `ORDER BY sort_key ASC` в SQL-запросы для корневых категорий и подкатегорий.

3. **Админка CMS Товары — UI (`app/pages/admin/cms/products.vue`):**
   - Удалена клиентская функция сортировки массива товаров `sortProdsByProperties`.

4. **Выгрузка товаров в Excel (`server/api/excel/get-products.get.js`):**
   - В SQL-запросе применено упорядочивание:
     ```sql
     JOIN i_categories c ON c.id = p.category_id
     ORDER BY c.ordering ASC, p.sort_key ASC
     ```

5. **AI-модуль товаров категории (`server/api/ai/productsData/[c_alias].js`):**
   - Добавлен `ORDER BY sort_key ASC` в запрос выборки товаров.
   - Удален дублирующий блок ручной сортировки.

6. **Админка CMS Документация (`server/api/admin/cms/documentation/getProds.js`):**
   - Добавлен `ORDER BY sort_key ASC` в SQL-запрос.
   - Удален избыточный блок построения фильтров и ручной сортировки товаров.

## Критерии приемки
- [x] Все указанные файлы переведены на сортировку `ORDER BY sort_key ASC`.
- [x] Фильтр каталога в `category/[c_alias].js` сохранен и функционирует штатно.
- [x] Старый ручной код `products.sort` по фильтрам полностью удален из бэкенда и фронтенда.
- [x] На страницах категорий порядок товаров визуально идентичен ГОСТ-каталогу.
- [x] Метод `/api/excel/get-products` возвращает товары, упорядоченные по категориям и `sort_key`.
