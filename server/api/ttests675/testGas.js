export default defineEventHandler(async event => {
  const cTime = new Date().toLocaleTimeString()
  console.log(`from apiTest: ${cTime}`)

  const aaa = {
    par1: 111,
    par2: 222,
  }

  const response = await $fetch(
    'https://script.google.com/macros/s/AKfycbxEyV5I_SX6XZtsYzpUhUFxJ4Oq0bXTeDw2Nj2coP4/dev',
    {
      redirect: 'follow',
      method: 'POST',
      body: JSON.stringify(aaa),
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
    }
  )
  console.log(`response: ${JSON.stringify(response, null, 2)}`)
  // const aaa = getRequestURL(event).toString().match(/(^.+)\/api\//)[1]
  // const ttt = typeof aaa
  // cv({ aaa, ttt })

  // for (const key in aaa) {
  //     const val = aaa[key]
  //     cv({key, val})
  // }

  // const origin = getRequestURL(event).origin
  // const baseURL = useRuntimeConfig().app.baseURL
  // let baseURL = '/'
  // let baseURL = '/test/'
  // if (baseURL[baseURL.length - 1] !== '/') baseURL += '/' // проверяем слеш в конце
  // const match = baseURL.match(/\/?(.+)[\/$]?/)
  // const match = baseURL.match(/\/?(.+)[\/$]/)
  // cv({origin, baseURL})

  // await timer(2)
  // if (Math.random() < .3) throw createError({statusCode: 481, statusMessage: `Random error on ${cTime}`})
  // throw createError({statusCode: 482, statusMessage: `Some error on ${cTime}`})
  // const body = await readBody(event)
  // console.log(`body: ${JSON.stringify(body, null, 2)}`)
  // const token = getRequestHeader(event, 'sessionToken')
  // // console.log(`user token: ${JSON.stringify(token, null, 2)}`)
  // if (!token || token === 'undefined') throw createError({ statusCode: 511, statusMessage: `Network Authentication Required!`})

  // const error = new Error(`error from throw Error`)
  // error.statusCode = 402
  // throw error

  // setCookie(event, 'someCook', `someValue`)

  return `Current Time -  ${cTime}`
  // return {
  //     'Current time': cTime,
  //     aaa: [111, 222, 333]
  // }
})
