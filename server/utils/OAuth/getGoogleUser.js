export default async (event) => {

    const config = useRuntimeConfig()
    const siteFullOrigin = getSiteFullOrigin(event)

    const code = getQuery(event).code

    const googleUrl = 'https://oauth2.googleapis.com/token'

    const values = {
        code,
        client_id: config.public.GOOGLE_CLIENT_ID,
        client_secret: config.GOOGLE_CLIENT_SECRET,
        redirect_uri: siteFullOrigin + 'api/auth/oauth/google',
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

    if (!validateMail(googleUser.email)) throw new Error('Incorrect mail format!')
    if (!googleUser.name?.length) googleUser.name = googleUser.email.match(/(^.+)@/)[1]

    return googleUser
}