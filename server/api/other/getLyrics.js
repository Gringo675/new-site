import https from 'node:https'

export default defineEventHandler(async (event) => {

    const {artist, track} = getQuery(event)
    console.log(`artist: ${JSON.stringify(artist, null, 2)}`)
    console.log(`track: ${JSON.stringify(track, null, 2)}`)

    if (!artist || !track) return {}

    return await doRequest(artist, track)
})

const doRequest = (artist, track) => {
    return new Promise((resolve) => {

        const url = encodeURI(`https://apic-desktop.musixmatch.com/ws/1.1/macro.subtitles.get?format=json&userblob_id=Y29vbF9kdWEgbGlwYV8yMDk&user_language=en&subtitle_format=mxm&app_id=web-desktop-app-v1.0&usertoken=2301040c1afc18c94cc79e68f9f33ad71dbb514526db524e878cff&guid=01f27f1f-6b49-46f7-8f5f-feef7f89bcdf&signature=NOE1lp9%2BQ69bAGgTHcfzckzNscw%3D&signature_protocol=sha1&q_artist=${artist}&q_track=${track}`)
        const options = {
            headers: {
                cookie: 'AWSELB=55578B011601B1EF8BC274C33F9043CA947F99DCFF8378C231564BC3E68894E08BD389E37D18357C7230C7B9CFDC33C1666B4FAD406CF57330A3F26A0D86825F74794F3C94; AWSELBCORS=55578B011601B1EF8BC274C33F9043CA947F99DCFF8378C231564BC3E68894E08BD389E37D18357C7230C7B9CFDC33C1666B4FAD406CF57330A3F26A0D86825F74794F3C94'
            }
        }


        https.get(url, options, (resp) => {

            let data = '';

            resp.on('data', (chunk) => {
                data += chunk;
            });

            resp.on('end', () => {
                try {
                    data = JSON.parse(data)
                    console.log(`data: ${JSON.stringify(data, null, 2)}`)
                    const lyrics = JSON.parse(data.message.body.macro_calls["track.subtitles.get"].message.body.subtitle_list[0].subtitle.subtitle_body)
                    console.log(`lyrics: ${JSON.stringify(lyrics, null, 2)}`)
                    resolve(lyrics)
                } catch (e) {
                    resolve(createError({ statusCode: 499, statusMessage: `Can't get lyrics: ${e.message}`}))
                }
            });
        }).on("error", (e) => {
            resolve(createError({ statusCode: 499, statusMessage: `Can't get lyrics: ${e.message}`}))
        });


    })
}