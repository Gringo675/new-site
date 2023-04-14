export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()

    const code = getQuery(event).code

    const googleUrl ='https://oauth2.googleapis.com/token'

    const values = {
        code,
        client_id: config.public.GOOGLE_CLIENT_ID,
        client_secret: config.GOOGLE_CLIENT_SECRET,
        redirect_uri: 'http://localhost:3000/test/api/auth/oauth/google',
        grant_type: 'authorization_code'
    }
    const body = Object.keys(values).map( key => `${key}=${encodeURI(values[key])}`).join('&')

    try {
        const {id_token} = await $fetch(googleUrl, {
            method: 'post',
            body,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
        })

        cv({id_token})

        const googleUser = JSON.parse(Buffer.from(id_token.split('.')[1], 'base64').toString())
        cv({googleUser})
    } catch (e) {
        console.log(`error: ${JSON.stringify(e.data, null, 2)}`)
    }

    return code

})