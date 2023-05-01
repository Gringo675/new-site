export default async (options = {}) => {
  options.force = options.force ?? false

  const user = useUser().value

  if (user.auth && !options.force) return

  const response = await myFetch('/api/user/getUser', {
    silent: true,
  })

  if (response) {
    user.auth = true
    for (const key in response) {
      user[key] = response[key]
    }
  } else console.log(`Can't get user!`)
}
