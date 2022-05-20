import request from "../src/mysql";
import { defineHandler } from 'h3'

export default defineHandler(async () => {
    // console.log(`from getProperties`);
    try {
        // const query = `SELECT * FROM i_properties WHERE group_id=0 ORDER by group_id, ordering`
        const query = `SELECT * FROM i_properties ORDER by group_id, ordering`
        return request(query)
    }catch (e) {
        console.log(`getProperties Error: ${e}`);
        return {}
    }
})