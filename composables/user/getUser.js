import useUser from "~/composables/user/useUser"
import refreshUser from "~/composables/user/refreshUser"

export default async () => {
    const { value: user } = useUser()
    if (!user.sessionToken || Date.parse(user.sessionExp) - 10e3 < Date.now()) {
        const isRefresh = await refreshUser()
        if (!isRefresh) return
    }
    const response = await $fetch('/api/user/getUser', {
        headers: {
            sessionToken: user.sessionToken
        }
    })
    // console.log(`user response: ${JSON.stringify(response, null, 2)}`)
    if (response.status === 'ok') {
        user.isAuth = true
        user.name = response.name
        user.isAdmin = response.isAdmin
        user.cart = response.cart
    }
}