// export default (req, res) => {
//     console.log(`req: ${req.url}`);
//     return `req.url: ${req.url}`
// }

import { defineHandler, useQuery, createError } from 'h3'

export default defineHandler(async (req, res) => {

    let qw = useQuery(req)

    if (qw.name.length < 3) {
        return createError({
            statusCode: 400,
            statusMessage: 'So small name...'
        })
    }

    return qw
})