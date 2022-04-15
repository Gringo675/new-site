import mysql from 'mysql2/promise'
const newBaseData = {
    host: process.env.DB_HOST_LOCAL,
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD
};

export default async (req) => {
    // функция по алиасу отдает информацию о товаре
    try {
        // вытаскиваем алиас из req.url
        if (!req.url.startsWith('/api/getProduct?alias=')) throw new Error('Alias parsing error!')
        const alias = req.url.substring(22)
        console.log(`API alias: ${alias}`);

        // create the connection
        const connection = await mysql.createConnection(newBaseData)
        // query database
        const query = `SELECT * FROM i_products WHERE alias = '${alias}' `;
        const [rows] = await connection.execute(query);
        const productData = rows[0]
        // console.log(`productData: ${JSON.stringify(productData)}`);
        return productData
    } catch (e) {
        console.log(`getProduct Error: ${e}`);
        return {}
    }

}