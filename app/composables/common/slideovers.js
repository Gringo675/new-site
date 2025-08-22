import { LazyCatsMenuSlider, LazyMobileMenuSlider } from '#components'

const overlay = useOverlay()

const catsMenu = overlay.create(LazyCatsMenuSlider)
const mobileMenu = overlay.create(LazyMobileMenuSlider)

export const showMobileMenu = () => mobileMenu.open()
export const hideMobileMenu = () => mobileMenu.close()

export const showCatsMenu = () => catsMenu.open()
export const hideCatsMenu = () => catsMenu.close()
