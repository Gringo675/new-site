export default async (event) => { 
    
    const config = useRuntimeConfig()
    const siteFullOrigin = getSiteFullOrigin(event)
    
    const code = getQuery(event).code

    const urlOrigin = 'https://oauth.vk.com/access_token'

    const values = {
        code,
        client_id: config.public.VK_CLIENT_ID,
        client_secret: config.VK_CLIENT_SECRET,
        redirect_uri: siteFullOrigin +'api/auth/oauth/vk'
    }
    const urlQuery = Object.keys(values).map(key => `${key}=${encodeURI(values[key])}`).join('&')

    const res = await $fetch(urlOrigin + '?' + urlQuery)

    const email = res.email
    if (!validateMail(email)) throw new Error('Incorrect mail format!')

    const userAccessURL = `https://api.vk.com/method/users.get?user_ids=${res.user_id}&access_token=${res.access_token}&v=5.131`

    const user = await $fetch(userAccessURL)

    let firstName
    try {
        firstName = user.response[0].first_name ?? ''
    } catch (e) {
        firstName = ''
    }
    let lastName
    try {
        lastName = user.response[0].last_name ?? ''
    } catch (e) {
        lastName = ''
    }
    let name
    if (!firstName.length && !lastName.length) {
        name = email.match(/(^.+)@/)[1]
    }
    else {
        name = firstName + (firstName.length && lastName.length ? ' ' : '') + lastName
    }
    
    return {
        email,
        name
    }
}