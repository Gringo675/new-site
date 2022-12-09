/**
 * Отвечает за открытие/закрытие сайта.
 * При get запросе отдает текущее состояние сайте.
 * При POST - меняет состояние.
 */

import decodeAndCheckToken from "~/server/src/decodeAndCheckToken"

export default defineEventHandler(async (event) => {

    decodeAndCheckToken(event, {adminOnly: true})

    const setStatus = (await readBody(event)).setStatus
    console.log(`setStatus: ${JSON.stringify(setStatus, null, 2)}`)

    if (setStatus === '0' || setStatus === '1') process.env.IS_SITE_CLOSED = setStatus

    return process.env.IS_SITE_CLOSED

})