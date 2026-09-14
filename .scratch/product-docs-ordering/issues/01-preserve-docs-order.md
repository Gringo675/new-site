# Игнорирование порядка документов из reestr_ids / standart_ids / pasport_ids на карточке товара и категории

Status: ready-for-agent

## Описание
При редактировании документов у товаров в админке оператор может менять их порядок (например, перемещать стрелочками в `AdminDocumentationProd.vue`).
Порядок ID сохраняется в БД в полях `reestr_ids`, `standart_ids`, `pasport_ids` через запятую (например, `15,3,42`).

Однако при запросе данных для карточки товара (`server/api/getData/product/[p_alias].js`) и категории (`server/api/getData/category/[c_alias].js`) делается выборка:
```sql
SELECT ... FROM i_docs_rstr WHERE id IN (15, 3, 42)
```
MySQL по умолчанию отдаёт результат сгруппированным и отсортированным по первичному ключу (`id ASC`), то есть `3, 15, 42`.

## Требуемые изменения
1. В эндпоинтах получения данных (`server/api/getData/product/[p_alias].js`, `server/api/getData/category/[c_alias].js` и др. при необходимости) обеспечить сохранение порядка документов в соответствии со списком ID.
2. Использовать `ORDER BY FIELD(id, ${rstrIds.join(',')})` или сортировку ответа в JavaScript по массиву запрашиваемых ID:
   ```js
   const docsMap = new Map(dbDocs.map(d => [d.id, d]))
   productData.docs.rstr = rstrIds.map(id => docsMap.get(id)).filter(Boolean)
   ```
