import request from "../src/mysql";

export default async (req) => {
    console.log(`from getProperties`);
    try {
        const query = `SELECT * FROM i_properties ORDER by group_id, ordering`;
        return request(query)
    }catch (e) {
        console.log(`getCategories Error: ${e}`);
        return {}
    }
}