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
        query = `UPDATE i_users SET ver_code = '' WHERE id = ${user.id}`
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
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Авторизация через OAuth</title>
      <style>
        body {
          background: #f4f4f4;
          font-family: 'Sofia Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          margin: 0;
          padding: 0;
        }
        .card {
          background: #fff;
          border-radius: 18px;
          box-shadow: 0 4px 24px 0 rgba(80, 56, 255, 0.08);
          padding: 32px 24px;
          max-width: 400px;
          margin: 60px auto;
          text-align: center;
        }
        .icon {
          margin-bottom: 18px;
        }
        .success {
          color: #6141f0;
        }
        .error {
          color: #f97316;
        }
        h2 {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 12px;
        }
        .btn {
          margin-top: 24px;
          padding: 12px 32px;
          font-size: 1rem;
          font-weight: 600;
          border: none;
          border-radius: 8px;
          background: #6141f0;
          color: #fff;
          cursor: pointer;
          transition: background 0.2s;
        }
        .btn:hover {
          background: #4b2fd6;
        }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="icon">
          ${
            resultText.includes('успешно')
              ? '<svg width="56" height="56" fill="none" viewBox="0 0 56 56"><circle cx="28" cy="28" r="28" fill="#ede9fe"/><path d="M18 29l7 7 13-13" stroke="#6141f0" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>'
              : '<svg width="56" height="56" fill="none" viewBox="0 0 56 56"><circle cx="28" cy="28" r="28" fill="#fff7ed"/><path d="M20 36L36 20M36 36L20 20" stroke="#f97316" stroke-width="3" stroke-linecap="round"/></svg>'
          }
        </div>
        <h2 class="${resultText.includes('успешно') ? 'success' : 'error'}">${resultText}</h2>
        <button class="btn" onclick="window.open('', '_self', ''); window.close();">Закрыть окно</button>
      </div>
    </body>
    </html>`
})
