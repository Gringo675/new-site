import useUser from "~/composables/user/useUser"

export default defineNuxtRouteMiddleware((to, from) => {

    const {value: user} = useUser()

    // console.log(`to: ${JSON.stringify(to, null, 2)}`)

    if (!user.isAuth) return navigateTo('/login?from=' + to.path)
    // if (to.params.id === '1') {
    //     return abortNavigation()
    // }
    // return navigateTo('/')
})
