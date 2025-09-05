export default defineEventHandler(async event => {
  // полностью переписывает таблицу i_users из старой базы

  try {
    let users = await dbOldReq(
      'SELECT `u_name`, `f_name`, `l_name`, firma_name, `email`, city, `phone` FROM `instr_jshopping_users`',
    )

    // допиливаем
    for (const user of users) {
      if (user.f_name || user.l_name) {
        user.name = `${user.f_name} ${user.l_name}`.trim()
      } else {
        user.name = user.email.split('@')[0]
      }

      user.admin = 0

      user.phone = processPhone(user.phone)
    }

    function processPhone(rawPhone) {
      let digits = rawPhone.replace(/\D/g, '')
      if (digits[0] === '7' || digits[0] === '8') {
        digits = digits.slice(1)
      }
      if (digits.length !== 10) {
        return ''
      }
      // Формат: xxx xxx-xx-xx
      return digits.replace(/(\d{3})(\d{3})(\d{2})(\d{2})/, '$1 $2-$3-$4')
    }

    // добавляем админа
    const admin = {
      email: 'gringo675g@gmail.com',
      name: 'Gringo',
      firma_name: 'ЧелИнструмент',
      city: 'Челябинск',
      phone: '955 555-55-55',
      admin: 1,
    }
    // удаляем админа и дубликаты, мешающие импорту
    users = users.filter(
      user => !['gringo675g@gmail.com', 'gringo675@yandex.ru', '7907748@rambler.ru'].includes(user.email),
    )
    users.unshift(admin)

    const currentDate = new Date().toISOString()

    const query = `INSERT INTO i_users (mail, name, admin, org, address, phone, created) VALUES ${users
      .map(
        user =>
          `('${user.email}', '${prepareString(user.name)}', '${user.admin}', '${prepareString(user.firma_name)}', '${prepareString(user.city)}', '${user.phone}', '${currentDate}')`,
      )
      .join(', ')}`

    await dbReq('TRUNCATE i_users') // удаляет все записи
    await dbReq(query)

    return { status: 'ok' }
  } catch (e) {
    console.error(e)
    return { status: 'error', message: e }
  }
})
