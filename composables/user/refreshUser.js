export default async () => {
    const { value: user } = useUser()
    try {
        const response = await $fetch('/api/auth/refresh')
        user.sessionToken = response.sessionToken
        user.sessionExp = response.sessionExp
        return true
    } catch (e) {
        console.log(`refresh error!`)
        return false
    }

}
