// возвращает "реальный" ориджин сайта с учетом baseURL

export default () => {

    const origin = window.location.origin
    let baseURL = useRuntimeConfig().app.baseURL
    if (baseURL[baseURL.length - 1] !== '/') baseURL += '/' // проверяем слеш в конце
    return origin + baseURL
}