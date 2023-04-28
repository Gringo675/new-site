// возвращает "реальный" ориджин сайта с учетом baseURL

export default (event) => {

    const origin = getRequestURL(event).origin
    let baseURL = useRuntimeConfig().app.baseURL
    if (baseURL[baseURL.length - 1] !== '/') baseURL += '/' // проверяем слеш в конце
    return origin + baseURL
}