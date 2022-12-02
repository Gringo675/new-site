/**
 * API для сохранения измененных категорий. Получает POST объект вида:
 * {
 *     catID: { // объект с измененными полями. Может содержать спец. ключи:
 *         isNew -  метка новой категории,
 *         isDel - метка удаленной категории (причем эти две метки могут быть одновременно, когда одну категорию удалили,
 *         а ее id достался новой категории)
 *     }, ...
 * }
 */

import request from "~/server/src/mysql"
import decodeAndCheckToken from "~/server/src/decodeAndCheckToken"
import prepareString from "~/server/src/prepareString"

export default defineEventHandler(async (event) => {

    decodeAndCheckToken(event, {adminOnly: true})

    const cats = await readBody(event)

    for (const catID in cats) {

        const cat = cats[catID]
        let query

        if (cat.isDel) {  // удаляем
            query = `DELETE FROM i_categories WHERE id = ${catID}`
            // console.log(`query: ${query}`);
            await request(query)
        }

        if (cat.isNew) {  // добавляем
            query = `INSERT INTO i_categories
                     SET id = ${catID}, `
            for (const key in cat) {
                if (key !== 'isDel' && key !== 'isNew') query += `${key} = '${prepareString(cat[key])}', `
            }
            query = query.slice(0, -2)
            // console.log(`query: ${query}`);
            await request(query)
        }

        if (!cat.isDel && !cat.isNew) {  // обновляем
            // console.log(`cat: ${JSON.stringify(cat, null, 2)}`)
            query = `UPDATE i_categories
                     SET `
            for (const key in cat) {
                query += `${key} = '${prepareString(cat[key])}', `
            }
            query = query.slice(0, -2)
            query += ` WHERE id = ${catID}`
            // console.log(`query: ${query}`);
            await request(query)
        }
    }

    return true

})
