import { LazyTheLogin } from '#components'

const login = useOverlay().create(LazyTheLogin)

export const showLogin = () => login.open()

export const closeLogin = () => login.close()
