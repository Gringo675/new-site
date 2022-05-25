import request from "../src/mysql";
import { defineHandler, useBody } from 'h3'

export default defineHandler(async (req) => {

    const postData = useBody(req)
    console.log(`postData: ${JSON.stringify(postData)}`);

    return 111
})