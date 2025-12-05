export default defineEventHandler(async (event) => {
    
    const mail = {
        to: 'chelinstrument@gmail.com',
        subject: 'Проверка почты',
        html: 'Здесь идет тело сообщения...'
    }

    const isSent = await sendMail(mail)

    return isSent

})