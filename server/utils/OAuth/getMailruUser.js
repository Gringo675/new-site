export default async (event) => {

    const config = useRuntimeConfig()
    const siteFullOrigin = getSiteFullOrigin(event)

    const code = getQuery(event).code

    const urlOrigin = 'https://oauth.mail.ru/token'

    const values = {
        code,
        client_id: config.public.MAILRU_CLIENT_ID,
        client_secret: config.MAILRU_CLIENT_SECRET,
        redirect_uri: siteFullOrigin + 'api/auth/oauth/mailru',
        grant_type: 'authorization_code'
    }

    const body = Object.keys(values).map(key => `${key}=${encodeURI(values[key])}`).join('&')

    const res = await $fetch(urlOrigin, {
        method: 'post',
        body
    })

    const userAccessURL = `https://oauth.mail.ru/userinfo?access_token=${res.access_token}`

    const user = await $fetch(userAccessURL)

    return {
        email: user.email,
        name: user.name
    }
}