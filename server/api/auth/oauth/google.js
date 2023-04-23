export default defineEventHandler(async (event) => {
    let resultText = ''
    try {

        const config = useRuntimeConfig()

        const code = getQuery(event).code

        const googleUrl = 'https://oauth2.googleapis.com/token'

        const values = {
            code,
            client_id: config.public.GOOGLE_CLIENT_ID,
            client_secret: config.GOOGLE_CLIENT_SECRET,
            redirect_uri: 'http://localhost:3000/test/api/auth/oauth/google',
            grant_type: 'authorization_code'
        }
        const body = Object.keys(values).map(key => `${key}=${encodeURI(values[key])}`).join('&')

        const { id_token } = await $fetch(googleUrl, {
            method: 'post',
            body,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
        })

        const googleUser = JSON.parse(Buffer.from(id_token.split('.')[1], 'base64').toString())

        // проверяем, есть ли юзер с данной почтой в базе
        let query = `SELECT id, ver_code, admin FROM i_users 
        WHERE mail = '${googleUser.email}' LIMIT 1`;
        let user = (await dbReq(query))[0]
        if (user) { // есть в базе
            if (user.ver_code !== 0) { // верифицируем юзера
                query = `UPDATE i_users SET ver_code = 0 WHERE id = ${user.id}`
                await dbReq(query)
            }
        } else { // добавляем
            user = {}
            query = `INSERT INTO i_users (mail, name, created)
             VALUES('${googleUser.email}', '${googleUser.name}', '${new Date().toISOString()}')`
            user.id = (await dbReq(query)).insertId
            user.admin = 0
        }

        createTokens(user, event) // устанавливаем cookie (refresh token)

        resultText = 'Данные успешно получены!'

    } catch (e) {
        console.log(`error: ${JSON.stringify(e.data, null, 2)}`)
        resultText = 'Ошибка при получении данных!'
    }

    return `<!DOCTYPE html>
            <html lang="ru">
            <head><meta charset="utf-8"></head>
            <body>
                <div style="display: flex; flex-direction: column; align-items: center;">
                    <h2>${resultText}</h2>
                    <button style="margin: 20px; padding: 10px 20px; font-size: 16px;" 
                            onclick="window.open('', '_self', ''); window.close();">Закрыть окно</button>
                </div>
            </body>
            </html>`

})