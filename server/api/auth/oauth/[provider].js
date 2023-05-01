export default defineEventHandler(async event => {
  let resultText = ''

  try {
    let oUser // .email & .name
    const provider = event.context.params.provider
    switch (provider) {
      case 'google':
        oUser = await getGoogleUser(event)
        break
      case 'vk':
        oUser = await getVkUser(event)
        break
      case 'mailru':
        oUser = await getMailruUser(event)
        break
      default:
        throw createError({ statusCode: 404, statusMessage: `Unsupported provider!` })
    }

    // проверяем, есть ли юзер с полученной почтой в базе
    let query = `SELECT id, ver_code, admin FROM i_users 
        WHERE mail = '${oUser.email}' LIMIT 1`
    let user = (await dbReq(query))[0]
    if (user) {
      // есть в базе
      if (user.ver_code !== 0) {
        // верифицируем юзера
        query = `UPDATE i_users SET ver_code = 0 WHERE id = ${user.id}`
        await dbReq(query)
      }
    } else {
      // добавляем
      user = {}
      query = `INSERT INTO i_users (mail, name, created)
             VALUES('${oUser.email}', '${oUser.name}', '${new Date().toISOString()}')`
      user.id = (await dbReq(query)).insertId
      user.admin = 0
    }

    createToken(user, event) // устанавливаем cookie

    resultText = 'Данные успешно получены!'
  } catch (e) {
    console.log(`error: ${JSON.stringify(e, null, 2)}`)
    resultText = 'Ошибка при получении данных!'
  }

  return `<!DOCTYPE html>
            <html lang="ru">
            <head><meta charset="utf-8"></head>
            <body>
                <div style="display: flex; flex-direction: column; align-items: center;">
                    <h2>${resultText}</h2>
                    <button style="margin: 20px; padding: 10px 20px; font-size: 16px;" 
                            onclick="window.open('', '_self', ''); window.close();">Закрыть окно</button>
                </div>
            </body>
            </html>`
})
