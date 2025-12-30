const initUser = () => {
  return {
    auth: false,
    admin: false,
    name: '',
    mail: '',
    org: '',
    inn: '',
    address: '',
    phone: '',
  }
}

export const useUser = () => {
  return useState('user', initUser)
}

export const logoutUser = async () => {
  const user = useUser()

  user.value = initUser() // сбрасываем состояние пользователя
  // удаляем cookie (refreshToken)
  await $fetch('/api/auth/logout')
  createUserEvent('0') // для обновления всех открытых вкладок
}

export const getUser = async (options = {}) => {
  options.hidden = options.hidden ?? false // не возвращать ошибки в случае неудачи
  options.force = options.force ?? false // для обновления данных

  const user = useUser().value

  if (user.auth && !options.force) return

  const url = '/api/user/getUser' + (options.hidden ? '?hidden=1' : '')

  try {
    const response = await $fetch(url)
    if (response) {
      user.auth = true
      for (const key in response) {
        user[key] = response[key]
      }
      createUserEvent('1') // для обновления всех открытых вкладок
    }
  } catch (e) {
    if (!options.hidden) {
      console.error(`Can't get user!`);
      throw createError(e)
    }
  }
}

export const createUserEvent = value => {
  localStorage.setItem('user-event', value)
  setTimeout(() => {
    localStorage.removeItem('user-event')
  }, 3000)
}
