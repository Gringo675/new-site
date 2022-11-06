export default () => {
    return useState('user', () => {
            return {
                isAuth: false
            }
        }
    )
}