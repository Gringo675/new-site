// по умолчанию Nuxt не прибавляет baseURL к динамически формируемым ссылкам к локальным ресурсам (папке public и assets), к примеру :src в теге img
// использование: <img :src="getDynamicAsset('/img/111.jpg')" />

export default path => useRuntimeConfig().app.baseURL + path
