export default defineEventHandler(async event => {
  const { q } = getQuery(event)
  const appkey = '07953400-E08A-4F57-8AD8-4D95596D7AA9'
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
    return response.cities
  } catch (e) {
    return []
  }
})
