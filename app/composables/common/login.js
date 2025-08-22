import { LazyTheLogin } from '#components'

const login = useOverlay().create(LazyTheLogin)

export const showLogin = () => login.open().result // promise

export const closeLogin = () => login.close()
