const config = useRuntimeConfig()

export const getVkUser = async event => {
  const siteFullOrigin = getSiteFullOrigin(event)

  const code = getQuery(event).code
  const urlOrigin = 'https://oauth.vk.com/access_token'
  const values = {
    code,
    client_id: config.public.VK_CLIENT_ID,
    client_secret: config.VK_CLIENT_SECRET,
    redirect_uri: siteFullOrigin + 'api/auth/oauth/vk',
  }
  const urlQuery = Object.keys(values)
    .map(key => `${key}=${encodeURI(values[key])}`)
    .join('&')
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
  } else {
    name = firstName + (firstName.length && lastName.length ? ' ' : '') + lastName
  }
  return {
    email,
    name,
  }
}

export const getMailruUser = async event => {
  const siteFullOrigin = getSiteFullOrigin(event)
  const code = getQuery(event).code
  const urlOrigin = 'https://oauth.mail.ru/token'
  const values = {
    code,
    client_id: config.public.MAILRU_CLIENT_ID,
    client_secret: config.MAILRU_CLIENT_SECRET,
    redirect_uri: siteFullOrigin + 'api/auth/oauth/mailru',
    grant_type: 'authorization_code',
  }
  const body = Object.keys(values)
    .map(key => `${key}=${encodeURI(values[key])}`)
    .join('&')
  const res = await $fetch(urlOrigin, {
    method: 'post',
    body,
  })
  const userAccessURL = `https://oauth.mail.ru/userinfo?access_token=${res.access_token}`
  const user = await $fetch(userAccessURL)
  return {
    email: user.email,
    name: user.name,
  }
}

export const getGoogleUser = async event => {
  const siteFullOrigin = getSiteFullOrigin(event)
  const code = getQuery(event).code
  const googleUrl = 'https://oauth2.googleapis.com/token'
  const values = {
    code,
    client_id: config.public.GOOGLE_CLIENT_ID,
    client_secret: config.GOOGLE_CLIENT_SECRET,
    redirect_uri: siteFullOrigin + 'api/auth/oauth/google',
    grant_type: 'authorization_code',
  }
  const body = Object.keys(values)
    .map(key => `${key}=${encodeURI(values[key])}`)
    .join('&')
  const { id_token } = await $fetch(googleUrl, {
    method: 'post',
    body,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })
  const googleUser = JSON.parse(Buffer.from(id_token.split('.')[1], 'base64').toString())
  if (!validateMail(googleUser.email)) throw new Error('Incorrect mail format!')
  if (!googleUser.name?.length) googleUser.name = googleUser.email.match(/(^.+)@/)[1]
  return googleUser
}
