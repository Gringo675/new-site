import request from "../src/mysql";

export default async () => {
    console.log(`from getCategories`);
    try {
        const query = `SELECT * FROM i_categories ORDER by id`;
        return request(query)
    }catch (e) {
        console.log(`getCategories Error: ${e}`);
        return {}
    }
}