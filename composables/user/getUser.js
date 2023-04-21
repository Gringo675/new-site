
export default async () => {
    
    const response = await myFetch('/api/user/getUser', {auth: true, silent: true})
    
    if (response) {
        const user = useUser().value
        user.isAuth = true
        for (const key in response) {
            user[key] = response[key]
        }
    } else console.log(`Can't get user!`)
}