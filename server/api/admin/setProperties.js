/**
 * API для сохранения измененных свойств. Получает POST массив из объектов. Каждый объект содержит один из ключей:
 * isNew - новое свойство (Insert)
 * isDel - удаленное свойство (Delete)
 * isChanged - измененное свойство (Update)
 */

import request from "~/server/src/mysql"

export default defineEventHandler(async (event) => {

    try { await timer(3)
        const props = await readBody(event)

        for (const prop of props) {

            let query

            if (prop.isDel) {
                query = `DELETE FROM i_properties WHERE id = ${prop.id}`
            } else if (prop.isNew) {
                query = `INSERT INTO i_properties
                         SET group_id = ${prop.group_id},
                             name     = '${prepareStringForMysql(prop.name)}',
                             ordering = ${prop.ordering}`
            } else if (prop.isChanged) {
                query = `UPDATE i_properties
                         SET name     = '${prepareStringForMysql(prop.name)}',
                             ordering = ${prop.ordering}
                         WHERE id = ${prop.id}`
            } else {
                throw new Error("prop object don't have required field!")
            }
            await request(query)
        }
        return 'ok'

    } catch (e) {
        console.log(`setProperties ERROR! ${e.message}`);
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

async function timer(sec) {
    let promise = new Promise((resolve, reject) => {
        setTimeout(() => resolve(), sec * 1000)
    });
    return await promise;
}