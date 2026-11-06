Status: open
Type: task
Blocked by: 03-update-triggers-and-admin-handlers.md

# 04 - Refactor Existing Sorting Points & Excel Export

## Описание
Заменить устаревшую ручную сортировку по свойствам в оперативной памяти (`products.sort(...)`) на прямую сортировку по индексу `ORDER BY sort_key ASC` во всех точках кодовой базы, а также упорядочить выгрузку товаров в Excel.

## Места рефакторинга в коде

1. **Публичный каталог (`server/api/getData/category/[c_alias].js`):**
   - В SQL-запрос `SELECT ... FROM i_products WHERE category_id = ? ...` добавить `ORDER BY sort_key ASC`.
   - Полностью удалить цикл в оперативной памяти:
     ```javascript
     // УДАЛИТЬ:
     products.sort((a, b) => {
       for (const fGroup of filter) { ... }
     })
     ```
   - За счет этого существенно снизится TTFB (время ответа) страниц категорий каталога.

2. **Выгрузка товаров в Excel (`server/api/excel/get-products.get.js`):**
   - Заменить `ORDER BY p.id ASC` на:
     ```sql
     ORDER BY p.category_id ASC, p.sort_key ASC
     ```
   - Товары в Excel на листе `prices` книги `prices&quantity.xlsm` начнут отображаться сгруппированными по категориям и размерным рядам ГОСТ (а не вперемешку по ID).

3. **AI-модуль товаров категории (`server/api/ai/productsData/[c_alias].js`):**
   - Добавить `ORDER BY sort_key ASC` в `productsQuery`.
   - Удалить дублирующий блок сортировки (строки 211–255).

4. **Админка CMS Документация (`server/api/admin/cms/documentation/getProds.js`):**
   - Добавить `ORDER BY sort_key ASC` в SQL-запрос.
   - Удалить ручную сортировку (строки 83–93).

5. **Админка CMS Товары (`app/pages/admin/cms/products.vue`):**
   - Очистить ручную сортировку массива товаров на клиенте (строки 270–295). Товары с сервера будут приходить уже отсортированными.

## Критерии приемки
- [ ] Все 5 указанных файлов переведены на сортировку `ORDER BY sort_key ASC`.
- [ ] Старый ручной код `products.sort` по фильтрам полностью удален из бэкенда и фронтенда.
- [ ] На страницах категорий порядок товаров визуально идентичен ГОСТ-каталогу.
- [ ] Метод `/api/excel/get-products` возвращает товары, упорядоченные по категориям и `sort_key`.
