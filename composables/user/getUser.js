export default async (options = {}) => {
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
      localStorage.setItem('user-event', '1') // для обновления всех открытых вкладок
    }
  } catch (e) {
    console.error(`Can't get user!`)
    throw createError(e)
  }
}
