export default defineEventHandler(async (event) => {

    const { mail, code } = await readBody(event)

    if (!mail || !code) throw createError({ statusCode: 400, statusMessage: `Bad request!` })

    if (mail && !code) { // step 1

        const code = getRandomCode()

        let query = `SELECT id FROM i_users WHERE mail = '${mail}' LIMIT 1`
        const user = (await request(query))[0]
        if (user) query = `UPDATE i_users SET 'ver_code' = ${code} WHERE id = ${user.id}`
        else query = `INSERT INTO i_users SET mail = '${mail}', 'ver_code' = ${code}`
        await request(query)

        const mailData = {
            to: mail,
            subject: 'Подтверждение входа на сайт chelinstrument.ru',
            html: `<div>
                        <h2>Ваш код авторизации:</h2>
                        <div style="font-size: 20px> ${code} </div>
                  </div>`
        }
        sendMail(mailData)
        return true
    }
    else if (code && mail) { // step 2

        const query = `SELECT id, ver_code, admin FROM i_users WHERE mail = '${mail}' LIMIT 1`
        const user = (await request(query))[0]
        if (user.ver_code !== code) return false

        query = `UPDATE i_users SET 'ver_code' = 0 WHERE id = ${user.id}`
        await request(query)
        return true
    }
    const query = `SELECT id, admin, pass
                   FROM i_users WHERE mail = '${mail}' LIMIT 1`;
    const user = (await request(query))[0]

    const { sessionToken, sessionExp } = createTokens(user, event)

    return {
        sessionToken,
        sessionExp
    }
})

const getRandomCode = () => {
    // возвращает случайное пятизначное число
    const min = 10000
    const max = 99999
    let rand = min + Math.random() * (max + 1 - min)
    return Math.floor(rand);
}