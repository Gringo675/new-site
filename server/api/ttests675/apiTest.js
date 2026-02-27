// import useTtest from '../utils/auth/useTtest'

export default defineEventHandler(async event => {
  const test = 'мышь'
  const chars = [...test]
  chars.forEach((c, i) => {
    console.log(`char ${i}: '${c}' = U+${c.codePointAt(0).toString(16)}`)
  })

  // Also check the map
  const mapSoftSign = 'ь'
  console.log(`map soft sign: U+${mapSoftSign.codePointAt(0).toString(16)}`)
  console.log(`input soft sign: U+${test[3].codePointAt(0).toString(16)}`)
  console.log(`Are they equal? ${mapSoftSign === test[3]}`)
  console.log(`transliterate('мышь'): ${JSON.stringify(transliterate('мышь'), null, 2)}`)
  return

  await new Promise(resolve => setTimeout(resolve, 2000))
  const cTime = new Date().toLocaleTimeString()
  console.log(`from apiTest: ${cTime}`)

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

  // await timer(4)
  // if (Math.random() < 0.3) throw createError({ statusCode: 481, statusMessage: `Random error on ${cTime}` })
  throw createError({ statusCode: 678, statusMessage: `Some error on ${cTime}` })
  // const body = await readBody(event)
  // console.log(`body: ${JSON.stringify(body, null, 2)}`)
  // const token = getRequestHeader(event, 'sessionToken')
  // // console.log(`user token: ${JSON.stringify(token, null, 2)}`)
  // if (!token || token === 'undefined') throw createError({ statusCode: 511, statusMessage: `Network Authentication Required!`})

  // const error = new Error(`error from throw Error`)
  // error.statusCode = 402
  // throw error

  // setCookie(event, 'someCook', `someValue`)

  // return `Current Time -  ${cTime}`
  return {
    'Current time': cTime,
    aaa: [111, 222, 333],
  }
})

async function timer(sec) {
  let promise = new Promise((resolve, reject) => {
    setTimeout(() => resolve(), sec * 1000)
  })
  return await promise
}
