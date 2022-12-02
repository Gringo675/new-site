export default (string) => {
    // функция экранирует спец. символы
    if (typeof string === 'string') { // только для строк
        string = string.replace(/\\/g, '\\\\')
        string = string.replace(/'/g, "\\'")
        string = string.replace(/\r\n/g, '\n')
    }
    return string
}