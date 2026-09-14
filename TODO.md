## chords
mySQL table structure for AI? (mySQL as mcp or tool)


## old id's replacement
- replace old_id in kirov, stiz prices
- excel
- 1C

## Log
- parse data
- add color bubbles for bot, human, server, client, isChunkError
- add filters bot/human, server/client
- links to url

## cms
Implement product and category date change functionality (for sitemap).
products:
- AI text generation
vendors:
- how to use discount price?
- how to set verification price? Relevant only for Kirov, create independent script.
- parse Kirov's stock?
prices:
- no consistency: quantity, notice (and no online access to .xls file). Solution - export .xls to mysql. Or better replace with online editor. (+ quantity case...). Another solution: Google Sheets.
- 1C interaction


# stage 1
- cms
- ProductsSlider: добавить кнопки прокрутки
- попытаться улучшить алгоритм поиска (indexSearch: eans -> full match)
- создать единый кеш для товаров, получаемых от getProducts.js (= /getData/products) (на данный момент используется в компонентах корзины и просмотренных товаров). Также изменить логику корзины - хранить в useCart только id и количество, а сами товары брать из кеша/сервера.
- Подумать про сохранение быстрых заказов (сейчас не сохраняются в базе)
- сохранять дату обновления страницы товара/категории и вставлять эту информацию в sitemap (lastmod). P.S. в базе у товаров уже есть поля date_modified и date_price_changed, правда пока не понятно, как будет обновляться date_modified.
- redesign
- Изображения в каталоге: привести все к 1:1 ratio и попробовать ai upscaling (хотя бы до 800px)


