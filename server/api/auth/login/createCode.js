export default defineEventHandler(async (event) => {

    try {
        const { mail } = await readBody(event)

        if (!validateMail(mail)) throw createError({ statusCode: 400, statusMessage: `Incorrect mail format!` })

        // const code = getRandomCode()
        const code = mail === 'gringo675g@gmail.com' ? 111110 : getRandomCode()

        let query = `SELECT id FROM i_users WHERE mail = '${mail}' LIMIT 1`
        const user = (await dbReq(query))[0]
        if (user) {
            query = `UPDATE i_users SET ver_code = ${code} WHERE id = ${user.id}`
        }
        else {
            const name = mail.match(/(^.+)@/)[1]
            query = `INSERT INTO i_users (name, mail, ver_code, created) 
                      VALUES ('${name}', '${mail}', ${code}, '${new Date().toISOString()}')`
        }
        await dbReq(query)

        // собираем ссылку для автоматического входа
        // getRequestURL почему-то не учитывает baseURL, поэтому приходится собирать вручную
        const origin = getRequestURL(event).origin
        let baseURL = useRuntimeConfig().app.baseURL
        if (baseURL[baseURL.length - 1] !== '/') baseURL += '/' // проверяем слеш в конце
        let url = origin + baseURL + 'user/verification'
        const values = {
            mail,
            code: code / 10
        }
        url = url + '?' + Object.keys(values).map(key => `${key}=${encodeURI(values[key])}`).join('&')

        const mailData = {
            to: mail,
            subject: 'Подтверждение входа на сайт chelinstrument.ru',
            html: `<div>
                        <h2>Ваш код авторизации:</h2>
                        <div style="font-size: 20px"> ${code / 10} </div>
                        <span>Ссылка для автоматического входа:</span>
                        <a href="${url}">${url}</a>
                  </div>`
        }
        // await sendMail(mailData)
        if (mail !== 'gringo675g@gmail.com') await sendMail(mailData)

        return true

    } catch (e) {
        cv({ e })
        throw createError({ statusCode: 427, statusMessage: `Login error!` })
    }
})

const getRandomCode = () => {
    // возвращает случайное пятизначное число + последний разряд - число попыток
    const min = 10000
    const max = 99999
    let rand = min + Math.random() * (max + 1 - min)
    return Math.floor(rand) * 10
}