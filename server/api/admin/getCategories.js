import request from "~/server/src/mysql"
import decodeAndCheckToken from "~/server/src/decodeAndCheckToken"

export default defineEventHandler(async (event) => {

    decodeAndCheckToken(event, {adminOnly: true})

    // console.log(`from getCategories`);
        // const query = `SELECT * FROM i_categories WHERE id = 12 OR id = 1201`;
        // const query = `SELECT * FROM i_categories WHERE id IN (12, 13) OR parent_id IN (12, 13) ORDER by id`;
        const query = `SELECT * FROM i_categories ORDER by id`;

        const rowCats = await request(query)
        // делаем "правильный" массив из натегорий (подкатегории вложены в родительские категории)
        // rowCats отсортирован по ИД, значит сначала наверняка будут основыные категории
        let cats = {}
        rowCats.forEach(cat => {
            if (cat.parent_id === 0) { // основная категория
                cats[cat.id] = cat
            } else { // "виртуальная" категория, засовываем ее в основную
                if (cats[cat.parent_id].children === undefined) cats[cat.parent_id].children = []
                cats[cat.parent_id].children.push(cat)
            }
        })
        cats = Object.values(cats).sort((a, b) => a.ordering - b.ordering) // преобразуем в массив и упорядочиваем
        cats.forEach(cat => { // упорядочиваем массив вложенных категорий
            if (cat.children !== undefined) cat.children.sort((a, b) => a.ordering - b.ordering)
        })

        return cats
})