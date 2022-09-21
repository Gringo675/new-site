import request from "../src/mysql"

export default defineEventHandler(async (event) => {
    // функция по алиасу отдает информацию о товаре
    try {
        const {alias} = useQuery(event)
        if (!alias.length) throw new Error('Alias parsing error!')
        // console.log(`API alias: ${alias}`);

        const query = `SELECT * FROM i_products WHERE alias = '${alias}' `;
        const productData = (await request(query))[0]
        // console.log(`productData: ${JSON.stringify(productData)}`);
        return productData
    } catch (e) {
        console.log(`getProduct Error: ${e}`);
        return {}
    }

})