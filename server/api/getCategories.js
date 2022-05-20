import request from "../src/mysql";
import { defineHandler } from 'h3'

export default defineHandler(async () => {

    // console.log(`from getCategories`);
    try {
        // const query = `SELECT * FROM i_categories WHERE id IN (11, 1101, 1102) ORDER by id`;
        const query = `SELECT * FROM i_categories ORDER by id`;

        return request(query)
    }catch (e) {
        console.log(`getCategories Error: ${e}`);
        return {}
    }
})
