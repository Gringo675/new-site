export default async () => {
  const user = useUser().value

  Object.keys(user).forEach(key => delete user[key])
  user.auth = false
  // удаляем cookie (refreshToken)
  await $fetch('/api/auth/logout')
  localStorage.setItem('user-event', '0') // для обновления всех открытых вкладок
}
