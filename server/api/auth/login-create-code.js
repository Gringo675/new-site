export default defineEventHandler(async (event) => {

    try {
        const { mail } = await readBody(event)

        if (!mail) throw createError({ statusCode: 400, statusMessage: `Bad request!` })

        const code = getRandomCode()

        let query = `SELECT id FROM i_users WHERE mail = '${mail}' LIMIT 1`
        const user = (await request(query))[0]
        if (user) {
            query = `UPDATE i_users SET ver_code = ${code} WHERE id = ${user.id}`
        }
        else {
            const name = 'User' // todo: достать имя из почты
            query = `INSERT INTO i_users (name, mail, ver_code, created) 
                      VALUES ('${name}', '${mail}', ${code}, '${new Date().toISOString()}')`
        }
        await request(query)

        const mailData = {
            to: mail,
            subject: 'Подтверждение входа на сайт chelinstrument.ru',
            html: `<div>
                        <h2>Ваш код авторизации:</h2>
                        <div style="font-size: 20px> ${code} </div>
                  </div>`
        }
        await sendMail(mailData)

        return true

    } catch (e) {
        cv({ e })
        throw createError({ statusCode: 427, statusMessage: `Login error!` })
    }
})

const getRandomCode = () => {
    // возвращает случайное пятизначное число
    const min = 10000
    const max = 99999
    let rand = min + Math.random() * (max + 1 - min)
    return Math.floor(rand);
}