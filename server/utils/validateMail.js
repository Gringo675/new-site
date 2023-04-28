export default (mail) => {
    const regexp = /^\S+@\S+\.(\S{2,})$/
    return regexp.test(mail)
}