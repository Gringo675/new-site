export default () => {
    return useState('pageSetup', () => {
            return {
                sortBy: 'order',
                prodsOnPage: 10,
            }
        }
    )
}
