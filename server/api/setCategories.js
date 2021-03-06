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

import request from "../src/mysql";
import {createError, defineHandler, useBody} from 'h3'

export default defineHandler(async (req, res) => {

    try {
        const cats = await useBody(req)

        for (const catID in cats) {

            const cat = cats[catID]
            let query

            if (cat.isDel) {  // удаляем
                query = `DELETE FROM i_categories WHERE id = ${catID}`
                console.log(`query: ${query}`);
                await request(query)
            }

            if (cat.isNew) {  // добавляем
                query = `INSERT INTO i_categories
                         SET id = ${catID}, `
                for (const key in cat) {
                    if (key !== 'isDel' && key !== 'isNew') query += `${key} = '${prepareStringForMysql(cat[key])}', `
                }
                query = query.slice(0, -2)
                console.log(`query: ${query}`);
                await request(query)
            }

            if (!cat.isDel && !cat.isNew) {  // обновляем
                query = `UPDATE i_categories
                         SET `
                for (const key in cat) {
                    query += `${key} = '${prepareStringForMysql(cat[key])}', `
                }
                query = query.slice(0, -2)
                query += ` WHERE id = ${catID}`
                console.log(`query: ${query}`);
                await request(query)
            }
        }

        return 'ok'

    } catch (e) {
        console.log(`setCategories ERROR! ${e.message}`);
        return createError({
            statusCode: 503,
            statusMessage: e.message
        })
    }

})

function prepareStringForMysql(string) {
    // функция экранирует спец. символы
    if (typeof string === 'string') { // только для строк
        string = string.replace(/\\/g, '\\\\')
        string = string.replace(/'/g, "\\'")
        string = string.replace(/\r\n/g, '\n')
    }
    return string
}