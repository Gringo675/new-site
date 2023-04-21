export default async () => {
    const { value: user } = useUser()
    try {
        const response = await $fetch('/api/auth/refresh')
        user.sessionToken = response.sessionToken
        user.sessionExp = response.sessionExp
        // await getUser() если нужен юзер, использовать getUser, который автоматом запустит refreshUser
        return true
    } catch (e) {
        console.log(`Can't refresh user!`)
        return false
    }
}