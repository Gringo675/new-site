import useUser from "~/composables/user/useUser"

export default async () => {
    const { value: user } = useUser()
    const response = await $fetch('/api/auth/refresh')
    console.log(`refresh response: ${JSON.stringify(response, null, 2)}`)
    if (response.status === 'ok') {
        user.sessionToken = response.sessionToken
        user.sessionExp = response.sessionExp
        return true
    }

    return false
}
