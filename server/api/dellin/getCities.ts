const config = useRuntimeConfig()

export default defineEventHandler(async event => {
  const { q } = getQuery(event)
  const appkey = config.DL_APP_KEY
  const params = {
    appkey,
    q,
    limit: 10,
  }
  try {
    const response = await $fetch('https://api.dellin.ru/v2/public/kladr.json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: params,
    })
    return ((response as { cities: any[] }).cities || []).map(city => ({
      name: city.aString,
      code: city.code,
    }))
  } catch (e) {
    return []
  }
})
