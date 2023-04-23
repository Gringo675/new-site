
export default async () => {

    const user = useUser().value

    if (user.isAuth) return
    
    const response = await myFetch('/api/user/getUser', {auth: true, silent: true})
    
    if (response) {
        user.isAuth = true
        for (const key in response) {
            user[key] = response[key]
        }
    } else console.log(`Can't get user!`)
}