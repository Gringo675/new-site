import useUser from "~/composables/user/useUser"

export default defineNuxtRouteMiddleware((to, from) => {

    // const {value: user} = useUser()
    // console.log(`auth to.path: ${JSON.stringify(to.path, null, 2)}`)
    // if (to.path.startsWith('/test')) {
    //     (!user.sessionId)
    //     {
            // setTimeout(() => showError({statusCode: 401, statusMessage: `Authentication Required!`}), 0)
            // throw createError({statusCode: 401, statusMessage: `Authentication Required!`, fatal: true})
            // showError({statusCode: 401, statusMessage: `Authentication Required!`})
            // return abortNavigation()
    //     }
    // }

    // if (!user.isAuth) return navigateTo('/login?from=' + to.path)
    // if (to.params.id === '1') {
    //     return abortNavigation()
    // }
    // return navigateTo('/')
})
