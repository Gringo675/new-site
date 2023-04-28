export default (provider) => {

    const config = useRuntimeConfig()
    const siteFullOrigin = getSiteFullOrigin()

    const OAuthProvidersData = {
        google: {
            rootURL: 'https://accounts.google.com/o/oauth2/v2/auth',
            options: {
                redirect_uri: siteFullOrigin + 'api/auth/oauth/google',
                client_id: config.GOOGLE_CLIENT_ID,
                access_type: 'offline',
                response_type: 'code',
                prompt: 'consent',
                scope: [
                    'https://www.googleapis.com/auth/userinfo.email',
                    'https://www.googleapis.com/auth/userinfo.profile'
                ].join(' ')
            }
        },
        vk: {
            rootURL: 'https://oauth.vk.com/authorize',
            options: {
                redirect_uri: siteFullOrigin + 'api/auth/oauth/vk',
                client_id: config.VK_CLIENT_ID,
                display: 'popup',
                response_type: 'code',
                v: '5.131',
                scope: 'email'
            }
        },
        mailru: {
            rootURL: 'https://oauth.mail.ru/login',
            options: {
                redirect_uri: siteFullOrigin + 'api/auth/oauth/mailru',
                client_id: config.MAILRU_CLIENT_ID,
                response_type: 'code',
                scope: 'userinfo',
                prompt_force: '1',
                state: 'some_state'
            }
        }
    }

    const rootURL = OAuthProvidersData[provider].rootURL
    const options = OAuthProvidersData[provider].options

    const qs = new URLSearchParams(options)

    return `${rootURL}?${qs.toString()}`
}