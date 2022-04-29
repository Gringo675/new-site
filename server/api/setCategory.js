// import request from "../src/mysql";

export default defineEventHandler(async (event) => {
    const body = await useBody(event)
    console.log(`body: ${JSON.stringify(body)}`);
    return { body }
})