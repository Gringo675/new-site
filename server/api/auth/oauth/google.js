export default defineEventHandler(async (event) => {
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

    try {
        const { id_token } = await $fetch(googleUrl, {
            method: 'post',
            body,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
        })

        const googleUser = JSON.parse(Buffer.from(id_token.split('.')[1], 'base64').toString())
        cv({ googleUser })
        // проверяем, есть ли юзер с данной почтой в базе
        let query = `SELECT id, ver_code, admin FROM i_users 
        WHERE mail = '${googleUser.email}' LIMIT 1`;
        let user = (await request(query))[0]
        if (user) { // есть в базе
            if (user.ver_code !== 0) { // верифицируем юзера
                query = `UPDATE i_users SET ver_code = 0 WHERE id = ${user.id}`
                await request(query)
                delete user.ver_code
            }
        } else { // добавляем
            user = {}
             query = `INSERT INTO i_users (mail, name)
             VALUES('${googleUser.email}', '${googleUser.name}')`
             user.id = (await request(query)).insertId
             user.admin = 0
        }

        cv({user})
        
        createTokens(user, event) // устанавливаем cookie

        return `<h1>Success!</h1>`
    } catch (e) {
        console.log(`error: ${JSON.stringify(e.data, null, 2)}`)
        return `<h1>Error!</h1>`
    }

    return code

})