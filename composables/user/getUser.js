
export default async () => {

    const response = await myFetch('/api/user/getUser', {auth: true})
    
    if (response) {
        const {value: user} = useUser()
        user.isAuth = true
        for (const key in response) {
            user[key] = response[key]
        }
    } else console.error(`Can't get user!`)
}