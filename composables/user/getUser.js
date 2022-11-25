import useUser from "~/composables/user/useUser"
import refreshUser from "~/composables/user/refreshUser"
import myFetch from "~/composables/common/myFetch"

export default async () => {

    const url = '/api/user/getUser'
    const response = await myFetch(url, {auth: true})
    if (response) {
        const {value: user} = useUser()
        user.isAuth = true
        for (const key in response) {
            user[key] = response[key]
        }
    } else console.error(`Can't get user!`)

    // try {
    //     const { value: user } = useUser()
    //     if (!user.sessionToken || Date.parse(user.sessionExp) - 10e3 < Date.now()) {
    //         const isRefresh = await refreshUser()
    //         if (!isRefresh) throw new Error('No sessionToken!')
    //     }
    //
    //     const response = await $fetch('/api/user/getUser', {
    //         headers: {
    //             sessionToken: user.sessionToken
    //         }
    //     })
    //     // console.log(`user response: ${JSON.stringify(response, null, 2)}`)
    //     user.isAuth = true
    //     for (const key in response) {
    //         user[key] = response[key]
    //     }
    //
    // } catch (e) {
    //     console.log(`Can't get user!`)
    // }

}