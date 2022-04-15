import mysql from 'mysql2/promise'
const newBaseData = {
    host: process.env.DB_HOST_LOCAL,
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD
};

export default async (req) => {
    // функция по id категории отдает товары
    try {
        // вытаскиваем алиас из req.url
        if (!req.url.startsWith('/api/getProducts?id=')) throw new Error('catID parsing error!')
        const catID = req.url.substring(20)
        // console.log(`API catID: ${catID}`);

        // create the connection
        const connection = await mysql.createConnection(newBaseData)
        // query database
        const query = `SELECT id, name, alias, brand_id, price, images, label_id,
                       p1_type, p2_counting_system, p3_range, p4_size, p5_accuracy, p6_class, p7_feature, p8_pack
                       FROM i_products WHERE category_id = '${catID}' AND published = 1`;
        const [products] = await connection.execute(query);

        // console.log(`products: ${JSON.stringify(products)}`);
        return products
    } catch (e) {
        console.log(`getProducts Error: ${e}`);
        return {}
    }

}